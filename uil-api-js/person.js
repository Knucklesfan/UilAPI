class person {

    year;
    personName;
    schoolName;
    scoreNum;
    placeNum;
    scoreEvent;
    region;
    district;

    constructor(name, school, score, place, event, rgion, dstrict, yer) {
        this.personName = name;
        this.schoolName = school;
        this.scoreNum = parseInt(score);
        this.placeNum = parseInt(place);
        this.scoreEvent = event;
        this.region = parseInt(dstrict);
        this.district = rgion;
        this.year = yer;
}


toString() {
    return "Person {" +
        "personName='" + this.personName + '\'' +
        ", schoolName='" + this.schoolName + '\'' +
        ", scoreNum=" + this.scoreNum +
        ", placeNum=" + this.placeNum +
        '}';
}
}

module.exports = {
    person
}