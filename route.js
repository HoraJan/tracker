const Route = function (route) {
    this.route = route;
    this.data = {points: []};
    for (let i = 1; i < this.route.geometry.coordinates.length; i++) {
        let point = {};
        point.point = this.route.geometry.coordinates[i];
        point.dl = calculateDistance(this.route.geometry.coordinates[i], this.route.geometry.coordinates[i - 1]);
        point.dt = (new Date(this.route.properties.coordTimes[i]) - new Date(this.route.properties.coordTimes[i - 1]))/1000;
        if (this.route.properties.heartRates) {
            point.hr = this.route.properties.heartRates[i];
        }
        point.de = this.route.geometry.coordinates[i][2] - this.route.geometry.coordinates[i - 1][2];
        point.dv = point.dl/point.dt;
        this.data.points.push(point);
    }
    this.data.l = this.data.points.reduce((a, sum) => {return {dl: a.dl+sum.dl};});
}

Route.prototype.getLength = function () {
    return (this.data.l.dl);
};

const calculateDistance = function (from, to) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((to[1] - from[1]) * p)/2 + 
            c(from[1] * p) * c(to[1] * p) * 
            (1 - c((to[0] - from[0]) * p))/2;
  
    return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

module.exports = Route;