/**
 * Google Apps Script for Phase 2 ESA Prototype
 * Handles structured JSON data from the application
 */

function doPost(e) {
  try {
    console.log('NEW SCRIPT VERSION - doPost called');
    console.log('Raw postData:', e.postData);
    console.log('Raw contents:', e.postData.contents);
    
    // Force create a debug sheet to prove this script is running
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let debugSheet = spreadsheet.getSheetByName('NEW_SCRIPT_DEBUG');
    if (!debugSheet) {
      debugSheet = spreadsheet.insertSheet('NEW_SCRIPT_DEBUG');
      debugSheet.getRange(1, 1, 1, 3).setValues([['Timestamp', 'Action', 'Data']]);
    }
    debugSheet.appendRow([new Date().toISOString(), 'doPost called', 'NEW SCRIPT VERSION']);
    
    // Parse the incoming data
    const requestData = JSON.parse(e.postData.contents);
    console.log('Parsed requestData:', requestData);
    console.log('Request type:', requestData.type);
    
    debugSheet.appendRow([new Date().toISOString(), 'Request type', requestData.type || 'NO_TYPE']);
    
    // Handle different data types
    if (requestData.type === 'structured_step_data') {
      console.log('Processing structured step data');
      debugSheet.appendRow([new Date().toISOString(), 'Processing', 'structured_step_data']);
      return handleStructuredStepData(requestData.data);
    } else {
      console.log('Processing legacy data');
      debugSheet.appendRow([new Date().toISOString(), 'Processing', 'legacy_data']);
      // Handle legacy data format for backward compatibility
      return handleLegacyData(requestData);
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    console.error('Error details:', error.toString());
    console.error('Stack trace:', error.stack);
    
    // Try to log error to debug sheet
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      let debugSheet = spreadsheet.getSheetByName('NEW_SCRIPT_DEBUG');
      if (debugSheet) {
        debugSheet.appendRow([new Date().toISOString(), 'ERROR', error.toString()]);
      }
    } catch (debugError) {
      console.error('Could not log to debug sheet:', debugError);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleStructuredStepData(data) {
  console.log('handleStructuredStepData called with data:', data);
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  console.log('Spreadsheet obtained:', spreadsheet.getName());
  
  // Create or get the structured data sheet
  let sheet = spreadsheet.getSheetByName('StructuredData');
  if (!sheet) {
    console.log('Creating new StructuredData sheet');
    sheet = spreadsheet.insertSheet('StructuredData');
    
    // Add headers for structured data
    const headers = [
      'Timestamp',
      'SessionId', 
      'Step',
      'StepName',
      'SiteName',
      'UWI',
      'Client',
      'LandUse',
      'SoilType',
      'Phase1Summary',
      'CleanText',
      'WordCount',
      'GenerationMethod',
      'ScoresJSON',
      'AverageScore',
      'FeedbackText',
      'HasImprovement',
      'HasPositive',
      'ContentSectionsJSON'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#4285f4')
      .setFontColor('white')
      .setFontWeight('bold');
  } else {
    console.log('Using existing StructuredData sheet');
  }
  
  // Debug the data structure
  console.log('Data structure check:');
  console.log('data.siteContext:', data.siteContext);
  console.log('data.content:', data.content);
  console.log('data.scores:', data.scores);
  console.log('data.feedback:', data.feedback);
  
  // Prepare row data with safe fallbacks
  const rowData = [
    data.timestamp || new Date().toISOString(),
    data.sessionId || 'NO_SESSION',
    data.step || 'NO_STEP',
    data.stepName || 'NO_STEP_NAME',
    (data.siteContext && data.siteContext.siteName) || 'NO_SITE_NAME',
    (data.siteContext && data.siteContext.uwi) || 'NO_UWI',
    (data.siteContext && data.siteContext.client) || 'NO_CLIENT',
    (data.siteContext && data.siteContext.landUse) || 'NO_LAND_USE',
    (data.siteContext && data.siteContext.soilType) || 'NO_SOIL_TYPE',
    (data.siteContext && data.siteContext.phase1Summary) || 'NO_PHASE1_SUMMARY',
    (data.content && data.content.cleanText) || 'NO_CLEAN_TEXT',
    (data.content && data.content.wordCount) || 0,
    (data.content && data.content.generationMethod) || 'NO_GENERATION_METHOD',
    JSON.stringify(data.scores || {}),
    data.averageScore || 0,
    (data.feedback && data.feedback.text) || 'NO_FEEDBACK',
    (data.feedback && data.feedback.hasImprovement) || false,
    (data.feedback && data.feedback.hasPositive) || false,
    data.contentSections ? JSON.stringify(data.contentSections) : ''
  ];
  
  console.log('Prepared row data:', rowData);
  
  // Add the row
  sheet.appendRow(rowData);
  console.log('Row added to StructuredData sheet');
  
  // Also create individual sheets for detailed analysis
  createDetailedSheets(spreadsheet, data);
  
  console.log('Structured data saved successfully');
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Structured data saved successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createDetailedSheets(spreadsheet, data) {
  // Create step-specific sheets for detailed analysis
  const stepSheetName = `Step${data.step}_Details`;
  let stepSheet = spreadsheet.getSheetByName(stepSheetName);
  
  if (!stepSheet) {
    stepSheet = spreadsheet.insertSheet(stepSheetName);
    
    // Add headers based on step type
    if (data.step === 4 && data.contentSections) {
      // Step 4: Content Generation Details
      const headers = [
        'Timestamp',
        'SessionId',
        'SiteName',
        'ExecutiveSummary',
        'SiteDescription', 
        'Methodology',
        'Results',
        'Conclusions',
        'Recommendations',
        'ProfessionalQuality',
        'TechnicalLanguage',
        'Completeness',
        'AverageScore',
        'FeedbackText'
      ];
      stepSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      const rowData = [
        data.timestamp,
        data.sessionId,
        data.siteContext.siteName,
        data.contentSections.executiveSummary,
        data.contentSections.siteDescription,
        data.contentSections.methodology,
        data.contentSections.results,
        data.contentSections.conclusions,
        data.contentSections.recommendations,
        data.scores.professionalQuality || '',
        data.scores.technicalLanguage || '',
        data.scores.completeness || '',
        data.averageScore,
        data.feedback.text
      ];
      stepSheet.appendRow(rowData);
      
    } else {
      // Generic step details
      const headers = [
        'Timestamp',
        'SessionId', 
        'StepName',
        'SiteName',
        'CleanText',
        'ScoresJSON',
        'AverageScore',
        'FeedbackText'
      ];
      stepSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      const rowData = [
        data.timestamp,
        data.sessionId,
        data.stepName,
        data.siteContext.siteName,
        data.content.cleanText,
        JSON.stringify(data.scores),
        data.averageScore,
        data.feedback.text
      ];
      stepSheet.appendRow(rowData);
    }
    
    // Format headers
    stepSheet.getRange(1, 1, 1, stepSheet.getLastColumn())
      .setBackground('#34a853')
      .setFontColor('white')
      .setFontWeight('bold');
  } else {
    // Just append data to existing sheet
    const lastRow = stepSheet.getLastRow();
    if (data.step === 4 && data.contentSections) {
      const rowData = [
        data.timestamp,
        data.sessionId,
        data.siteContext.siteName,
        data.contentSections.executiveSummary,
        data.contentSections.siteDescription,
        data.contentSections.methodology,
        data.contentSections.results,
        data.contentSections.conclusions,
        data.contentSections.recommendations,
        data.scores.professionalQuality || '',
        data.scores.technicalLanguage || '',
        data.scores.completeness || '',
        data.averageScore,
        data.feedback.text
      ];
      stepSheet.appendRow(rowData);
    } else {
      const rowData = [
        data.timestamp,
        data.sessionId,
        data.stepName,
        data.siteContext.siteName,
        data.content.cleanText,
        JSON.stringify(data.scores),
        data.averageScore,
        data.feedback.text
      ];
      stepSheet.appendRow(rowData);
    }
  }
}

function handleLegacyData(data) {
  console.log('handleLegacyData called with data:', data);
  
  // Handle old format for backward compatibility
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('LegacyData');
  
  if (!sheet) {
    console.log('Creating new LegacyData sheet');
    sheet = spreadsheet.insertSheet('LegacyData');
    const headers = ['Timestamp', 'Site', 'UWI', 'Client', 'Step', 'ScoreType', 'ScoreValue', 'Feedback', 'OutputContent'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    console.log('Using existing LegacyData sheet');
  }
  
  const rowData = [
    new Date().toISOString(),
    data.site || '',
    data.uwi || '',
    data.client || '',
    data.step || '',
    data.scoreType || '',
    data.scoreValue || '',
    data.feedback || '',
    data.outputContent || ''
  ];
  
  console.log('Legacy row data:', rowData);
  sheet.appendRow(rowData);
  console.log('Row added to LegacyData sheet');
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Legacy data saved successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Debug function to check what sheets exist
function debugSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  console.log('Existing sheets:');
  sheets.forEach(sheet => {
    console.log('- ' + sheet.getName() + ' (rows: ' + sheet.getLastRow() + ')');
  });
}

// Function to manually create a test entry to verify the script is working
function createTestEntry() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('DEBUG_TEST');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('DEBUG_TEST');
    sheet.getRange(1, 1, 1, 3).setValues([['Timestamp', 'Message', 'Script Version']]);
  }
  
  sheet.appendRow([new Date().toISOString(), 'Manual test entry', 'NEW_SCRIPT_VERSION']);
  console.log('Test entry created in DEBUG_TEST sheet');
}

// Test function to verify the script works
function testScript() {
  const testData = {
    type: 'structured_step_data',
    data: {
      sessionId: 'TEST-SESSION',
      timestamp: new Date().toISOString(),
      step: 1,
      stepName: 'Test Step',
      siteContext: {
        siteName: 'Test Site',
        uwi: 'TEST-UWI',
        client: 'Test Client',
        landUse: 'test',
        soilType: 'test',
        phase1Summary: 'Test summary'
      },
      content: {
        cleanText: 'Test content',
        wordCount: 2,
        generationMethod: 'test'
      },
      scores: {
        test: 100
      },
      averageScore: 100,
      feedback: {
        text: 'Test feedback',
        hasImprovement: false,
        hasPositive: true
      }
    }
  };
  
  console.log('Test result:', handleStructuredStepData(testData.data));
}