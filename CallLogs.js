// Call Tracking Script

// Select current account
// Init Spreadsheet
// Select current campaigns
// Generate an AQL Query to grab call metrics
    // Metrics - AdGroupName, CallStartTime, CallerCountryCallingCode, CampaignName, Date, Month, Year
// Print report out for each campaign in spreadsheet

function main() {
    // Select the current account
    var currentAccount = AdWordsApp.currentAccount();
    var accountName = currentAccount.getName();
    Logger.log("Account: " + accountName);

    // Init Spreadsheet
    var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1mPtQWBuk-Kk15K-OlqRA96HvR-lAX6mcm8TkgAZCqwU/edit?usp=sharing');
    var sheet = spreadsheet.getSheets()[0];

    var callString = "SELECT CampaignName, AdGroupName, Date, Month, CallStartTime, CallDuration, CallStatus, CallTrackingDisplayLocation, CallerCountryCallingCode FROM CALL_METRICS_CALL_DETAILS_REPORT DURING THIS_MONTH";


    var campaignSelector = AdWordsApp
        .campaigns()
        .withCondition("Status = ENABLED");

    var campaignIterator = campaignSelector.get();

    while(campaignIterator.hasNext()) {
        // Iterate over the number of campaigns
        var campaign = campaignIterator.next();
        // Get the campaign name
        var campaignName = campaign.getName();
        Logger.log("Campaign Name: " + campaignName);

        // Init report with query string
        var report = AdWordsApp.report(callString);
        var iter = report.rows();
        // Print Report to spreadsheet with results data
        while(iter.hasNext()) {
            var reportRow = iter.next();
            sheet.appendRow([
                reportRow["CampaignName"],
                reportRow["AdGroupName"],
                reportRow["Date"],
                reportRow["CallStartTime"],
                reportRow["CallDuration"],
                reportRow["CallStatus"],
                reportRow["CallTrackingDisplayLocation"],
                reportRow["CallerCountryCallingCode"]
            ]);
        }
    }
}