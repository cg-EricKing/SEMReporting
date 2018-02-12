// SEM Reporting Script - Version 1 Multi Account

// Select accounts based on label
// Init Spreadsheet to view report
// Select campaigns
    // Filter conditions - ENABLED, IMPRESSIONS > 0
// Get a report with an AQL String
    // Date Range - THIS_MONTH, LAST_MONTH
    // Metrics - Impressions, Clicks, QualityScore, CPC, CostPerConversion, Ctr
// Print report to a spreadsheet and format

function main() {
    // Init Spreadsheet
    var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1mRbD0jN-i1Jy7HVIySBvKnxfLc7ADKwzpn5nfXOdalg/edit?usp=sharing');
    var sheet = spreadsheet.getSheets()[0];


    // Select accounts with label
    var accountSelector = MccApp
        .accounts()
        .withCondition("LabelNames CONTAINS 'CMS-CTC'")
        .withLimit(50);

    var accountIterator = accountSelector.get();

    while(accountIterator.hasNext()) {
        // Iterate over the accounts and access them
        var account = accountIterator.next();
        MccApp.select(account);
        // Generate a AQL Query string with desired metrics
        var reportString = "SELECT AccountDescriptiveName, CampaignName, StartDate, Clicks, Impressions, AverageCpc, CostPerConversion, Ctr FROM CAMPAIGN_PERFORMANCE_REPORT WHERE CampaignStatus = ENABLED DURING LAST_7_DAYS";
        
        // Init report with query string - iterate account data into rows
        var report = AdWordsApp.report(reportString);
        var iter = report.rows();
        while(iter.hasNext()) {
            var reportRow = iter.next();

            sheet.appendRow([
                reportRow["AccountDescriptiveName"],
                reportRow["CampaignName"],
                reportRow["StartDate"],
                reportRow["Clicks"],
                reportRow["Impressions"],
                reportRow["AverageCpc"],
                reportRow["CostPerConversion"],
                reportRow["Ctr"]
            ]);
        }
    }
}