import { Injectable } from '@angular/core';
import { Page, Story } from '../../../models/story';

@Injectable({
  providedIn: 'root',
})
export class GamebookValidator {

  private WHOLE_STORY: Story = new Story();
  private TREE_PRINT = '';
  /**
   * LIGHT BREAK = story is broken, but can continue to run validation. Fixing this will probably not affect other items.
   * MEDIUM BREAK = story is broken. Validation can continue, but when this is fixed, other defects might be found on retest.
   * BREAK = story is broken and cannot continue validation. Fix this and retest.
   * @param {*} story
   */
  public validateStoryStructure(story: Story) {
    this.WHOLE_STORY = story;
    let foundErrors = false;
    const allErrors = {
      foundErrors: false,
      missingIds: [],
      hasAtLeast1StartPage: false,
      moreThan1StartPagePages: [],
      isLowestPageIdStartPage: false,
      isLengthCorrect: false,
      duplicateIdNumbers: [],
      skippedIdNumbers: [],
      pagesWithNoPath: [],
      pagesWithCircularPath: [],
      pagesWithBothEndAndPath: [],
      pagesWithMissingPath: [],
      pagesWithRepeatedPaths: [],
      pagesWithInvalidPathGoTo: [],
      orphanPages: [],
      treePrint: ''
    };

    const missingIds = this.checkIfAllArrayItemsHaveIds(story.pages);
    // if missingIds.length > 0 => BREAK
    if(missingIds.length > 0) {
      console.error('MISSING IDS ERROR', missingIds)
      allErrors.foundErrors = true;
    }

    story.pages.sort((a, b) => a.id - b.id);
    const startPagePresentAndCorrect = this.checkForStartPageAndCorrectlySetup(story.pages);
    // if startPagePresentAndCorrect.hasAtLeast1StartPage === false => LIGHT BREAK
    if(!startPagePresentAndCorrect.hasAtLeast1StartPage) {
      console.error('NO START PAGE ERROR')
      allErrors.foundErrors = true;
    }
    // if startPagePresentAndCorrect.moreThan1StartPagePages.length > 0 => LIGHT BREAK
    if(startPagePresentAndCorrect.moreThan1StartPagePages.length > 0) {
      console.error('MORE THAN 1 START PAGE ERROR', startPagePresentAndCorrect.moreThan1StartPagePages)
      allErrors.foundErrors = true;
    }
    // report but don't break on startPagePresentAndCorrect.isLowestPageIdStartPage === true
    if(!startPagePresentAndCorrect.isLowestPageIdStartPage) {
      console.error('FIRST ENTRY IS NOT START PAGE ERROR')
      allErrors.foundErrors = true;
    }

    const pageSequenceCheckResults = this.checkArrayIdNumbersForDuplicatesAndSequence(story.pages);
    // if pageSequenceCheckResults.duplicateIdNumbers.length > 0 => MEDIUM BREAK
    if(pageSequenceCheckResults.duplicateIdNumbers.length > 0) {
      console.error('DUPLICATE IDS ERROR', pageSequenceCheckResults.duplicateIdNumbers)
      allErrors.foundErrors = true;
    }
    // report but don't break on pageSequenceCheckResults.isLengthCorrect === false
    if(!pageSequenceCheckResults.isLengthCorrect) {
      console.error('SEQUENCE LENGTH ERROR')
      allErrors.foundErrors = true;
    }
    // report and list but don't break on pageSequenceCheckResults.skippedIdNumbers.length > 1
    if(pageSequenceCheckResults.skippedIdNumbers.length > 0) {
      console.error('MORE THAN 1 MISSING PAGE ERROR', pageSequenceCheckResults.skippedIdNumbers)
      allErrors.foundErrors = true;
    }

    const pagesWithBrokenPaths = this.checkIfAllPagesHavePathAndPathIsValid(story.pages);
    // if pagesWithBrokenPaths.pagesWithNoPath.length > 0 => BREAK
    if(pagesWithBrokenPaths.pagesWithNoPath.length > 0) {
      console.error('PAGES HAVE NO PATHS ERROR', pagesWithBrokenPaths.pagesWithNoPath)
      allErrors.foundErrors = true;
    }
    // if pagesWithBrokenPaths.pagesWithCircularPath.length > 0 => MEDIUM BREAK
    if(pagesWithBrokenPaths.pagesWithCircularPath.length > 0) {
      console.error('CIRCULAR PATH ERROR', pagesWithBrokenPaths.pagesWithCircularPath)
      allErrors.foundErrors = true;
    }
    // report and list but don't break on pagesWithBrokenPaths.pagesWithBothEndAndPath.length > 0
    if(pagesWithBrokenPaths.pagesWithBothEndAndPath.length > 0) {
      console.error('PAGES HAVE BOTH END AND GOTO ERROR', pagesWithBrokenPaths.pagesWithBothEndAndPath)
      allErrors.foundErrors = true;
    }
    // if pagesWithBrokenPaths.pagesWithMissingPath.length > 0 => MEDIUM BREAK
    if(pagesWithBrokenPaths.pagesWithMissingPath.length > 0) {
      console.error('PAGES HAVE MISSING PATHS ERROR', pagesWithBrokenPaths.pagesWithMissingPath)
      allErrors.foundErrors = true;
    }
    // report and list but don't break on pagesWithBrokenPaths.pagesWithRepeatedPaths.length > 0
    if(pagesWithBrokenPaths.pagesWithRepeatedPaths.length) {
      console.error('PAGE HAS REPEATED PATHS ON SAME PAGE ERROR', pagesWithBrokenPaths.pagesWithRepeatedPaths)
      allErrors.foundErrors = true;
    }
    // if pagesWithBrokenPaths.pagesWithInvalidPathGoTo.length > 0 => MEDIUM BREAK
    if(pagesWithBrokenPaths.pagesWithInvalidPathGoTo.length > 0) {
      console.error('PAGES HAVE INVALID PATH ERROR', pagesWithBrokenPaths.pagesWithInvalidPathGoTo)
      allErrors.foundErrors = true;
    }

    // Check for orphan pages
    const orphanPages = this.checkForOrphanPages(story.pages);
    // report and list but don't break on orphanPages.length > 1
    // set to 1 as technically the start page has nothing calling it, therefore it is an orphan
    if(orphanPages.length > 1) {
      console.error('ORPHAN PAGES ERROR', orphanPages)
      allErrors.foundErrors = true;
    }

    // Print out path structure...
    this.checkAndPrintTree(story.pages);
    allErrors.treePrint = this.TREE_PRINT;

    if(foundErrors) {
      console.error('Errors found in validation, please see above for more information.');
    } else {
      console.log(`Congrats! No errors found in validation!`);
    }
    return allErrors;

  }

  /**
   * Checks if there is any items in the array that are either missing the 'id' property or
   * do not have an integer for the id. (breaking)
   * @param {*} a
   * @returns
   */
  protected checkIfAllArrayItemsHaveIds(a: any[]) {
    return a.filter(a => !('id' in a) || !Number.isInteger(a.id));
  }

  protected checkForStartPageAndCorrectlySetup(pages: Page[]) {
    const startPageFilter = pages.filter(p => p.start === true);
    const hasAtLeast1StartPage = startPageFilter.length > 0;
    const moreThan1StartPagePages: number[] = [];
    if (startPageFilter.length > 1) {
      startPageFilter.forEach(p => moreThan1StartPagePages.push(p.id));
    }
    const isLowestPageIdStartPage = (pages[0].start && pages[0].start)?? false;
    return {
      hasAtLeast1StartPage: hasAtLeast1StartPage,
      moreThan1StartPagePages: moreThan1StartPagePages,
      isLowestPageIdStartPage: isLowestPageIdStartPage
    }
  }

  /**
   * Checks if there are the correct number of pages (not breaking),
   * if there missing numbers (not breaking), or
   * if there are any duplicate numbers. (breaking)
   * @param {*} a - must be sorted a.id - b.id (asc) before here.
   */
  protected checkArrayIdNumbersForDuplicatesAndSequence(a: any[]) {
    const idNumbers: number[] = [];

    // Check if lastId - firstId === pages.length to see if there is a discrepancy.
    const isLengthCorrect = a[a.length - 1].id - a[0].id === a.length - 1;

    // Check each number to see if anything is skipped or duplicated
    const skippedIdNumbers = [];
    const duplicateIdNumbers = [];
    const startingIdOffset = a[0].id;
    for (let i = 0; i < a[a.length - 1].id; i++) {
      const currentId = a[i].id;
      if (i + startingIdOffset !== currentId) {
        skippedIdNumbers.push(i + startingIdOffset);
        if (idNumbers.includes(currentId)) {
          duplicateIdNumbers.push(currentId);
        }
      } else {
        // Duplicate check
        if (idNumbers.includes(currentId)) {
          duplicateIdNumbers.push(currentId);
        } else {
          idNumbers.push(currentId);
        }
      }
    }
    return {
      isLengthCorrect: isLengthCorrect,
      skippedIdNumbers: skippedIdNumbers,
      duplicateIdNumbers: duplicateIdNumbers
    };
  }



  /**
   * Checks for the following:
   * pagesWithNoPath - not marked as an end thread and the path array is either missing or has a length of 0 (breaking)
   * pagesWithCircularPath - there is only 1 path and it links back to the same page. (breaking)
   * pagesWithBothEndAndPath - this has both paths and an end marker. (not breaking)
   * pagesWithMissingPath - at least one of the path.goToPage is either missing or is not a number. (breaking)
   * pagesWithRepeatedPaths - this path is pointing to the same page as another path on the same page. (not breaking)
   * pagesWithInvalidPathGoTo - the goToPath does not exist as a page number (breaking)
   * @param {*} pages
   */
  protected checkIfAllPagesHavePathAndPathIsValid(pages: Page[]) {
    const pagesWithNoPath: number[] = [];
    const pagesWithCircularPath: number[] = [];
    const pagesWithBothEndAndPath: number[] = [];
    const pagesWithMissingPath: number[] = [];
    const pagesWithRepeatedPaths: number[] = [];
    const pagesWithInvalidPathGoTo: number[] = [];

    pages.forEach(page => {
      if ((page.end !== true) && (page.paths && page.paths.length < 1)) {
        pagesWithNoPath.push(page.id);
      } else if (page.paths?.length === 1 && page.paths[0].goToPage === page.id) {
        pagesWithCircularPath.push(page.id);
      } else if(page.paths) {
        if (page.paths.length > 0 && page.end === true) {
          pagesWithBothEndAndPath.push(page.id);
        }
        const goToPages: number[] = [];
        page.paths.forEach(path => {
          if (path.goToPage && !Number.isInteger(path.goToPage)) {
            pagesWithMissingPath.push(page.id);
          } else {
            if (!pages.find(page => page.id === path.goToPage)) {
              pagesWithInvalidPathGoTo.push(page.id);
            }
            if (goToPages.includes(path.goToPage)) {
              pagesWithRepeatedPaths.push(page.id);
            } else goToPages.push(page.id);
          }

        });
      }
    });
    return {
      pagesWithNoPath: pagesWithNoPath,
      pagesWithBothEndAndPath: pagesWithBothEndAndPath,
      pagesWithCircularPath: pagesWithCircularPath,
      pagesWithMissingPath: pagesWithMissingPath,
      pagesWithRepeatedPaths: pagesWithRepeatedPaths,
      pagesWithInvalidPathGoTo: pagesWithInvalidPathGoTo
    }
  }

  protected checkForOrphanPages(pages: Page[]) {
    const listOfAllPageIds = pages.map(page => { return page.id });
    const listOfAllUsedPages: number[] = [];

    pages.forEach(page => {
      if(page.paths && page.paths.length > 0) {
        page.paths.forEach(path => {
          if (!listOfAllUsedPages.includes(path.goToPage)) {
            listOfAllUsedPages.push(path.goToPage)
          }
        });
      }
    });
    return this.getSymmetricDifference(listOfAllPageIds, listOfAllUsedPages);
  }

  protected checkAndPrintTree(pages: Page[]) {
    this.TREE_PRINT = '';
    this.printTree(pages[0], '', true);
  }

  protected printTree(node: any, indent: string, last = true) {
    let line = indent;
    if(last) {
      line += '\\--';
      indent += '    ';
    } else {
      line += '|--';
      indent += '|   ';
    }
    const title = node.title?.length > 0? node.title : 'MISSING TITLE';
    const text = node.pageText?.length > 0? '' : ' - NO PAGE TEXT FOUND';
    const printLine = `${line} ${node.id}:${title}${text}`;
    this.TREE_PRINT += `${printLine}\n`;
    // console.log(printLine);
    if(node.paths && node.paths.length > 0) {
      for (let i = 0; i < node.paths.length; i++) {
        const isLast = i === node.paths.length - 1;
        const nextPage = this.WHOLE_STORY.pages.find(wp => wp.id === node.paths[i].goToPage);
        this.printTree(nextPage, indent, isLast);
      }
    }
  }


  /**
   * Compares 2 arrays and finds the items in one of the arrays but not both arrays.
   * @param {*} a1
   * @param {*} a2
   * @returns
   */
  protected getSymmetricDifference(a1: any[], a2: any[]) {
    const s1 = new Set(a1);
    const s2 = new Set(a2);
    const diff1 = [...s1].filter(item => !s2.has(item));
    const diff2 = [...s2].filter(item => !s1.has(item));
    return diff1.concat(diff2);
  }


}
