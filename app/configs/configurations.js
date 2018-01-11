function appConfigurations() {
}

var configurations = new appConfigurations();

appConfigurations.prototype.debug = true;

appConfigurations.prototype.webUrl = "http://127.0.0.1:8080/";
appConfigurations.prototype.id = "default";
appConfigurations.prototype.appName = "Bidgely";
appConfigurations.prototype.pilotId = 0;
appConfigurations.prototype.utilityName = "Bidgely";
appConfigurations.prototype.defaultState = "login";

appConfigurations.prototype.utilityPilots = [
    {url: "nvepatapi.bidgely.com", name: "NVE PAT", token: "09af7d48-1ee8-4190-8dff-207dab41415a"},
    {url: "qaapi.bidgely.com", name: "QA", token: "22edc216-0259-47a4-9324-745d1e845ec0"}
];
appConfigurations.prototype.emailEvents = ["MONTHLY_SUMMARY", "NEIGHBOURHOOD_COMPARISON", "USAGE_ALERT", "BILL_PROJECTION", "AO_SAVINGS"];
// eu 6674292d-058e-4af9-acea-e4bce1fb2f85
