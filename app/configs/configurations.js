function appConfigurations() {
}

var configurations = new appConfigurations();

appConfigurations.prototype.debug = true;

appConfigurations.prototype.id = "default";
appConfigurations.prototype.appName = "Bidgely";
appConfigurations.prototype.pilotId = 0;
appConfigurations.prototype.utilityName = "Bidgely";
appConfigurations.prototype.defaultState = "login";

appConfigurations.prototype.utilityPilots = [
    {url: "na-read.bidgely.com", name: "na", token: "admin:admin"},
    {url: "euapi.bidgely.com", name: "eu", token: "6674292d-058e-4af9-acea-e4bce1fb2f85"}
];
