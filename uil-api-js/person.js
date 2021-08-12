class Person {

    year;
    personName;
    schoolName;
    scoreNum;
    placeNum;
    scoreEvent;
    region;
    district;

    constructor(name, school, score, place, rgion, dstrict)
    {
    this.personName = name;
        this.schoolName = school;
        this.scoreNum = score;
        this.placeNum = place;
        this.region = dstrict;
        this.district = rgion;
    }
    constructor(name, school, score, place, rgion, dstrict) {
        this.personName = name;
        this.schoolName = school;
        this.scoreNum = score;
        this.placeNum = place;
        this.region = dstrict;
        this.district = rgion;

}
    constructor(name, school, score, place, event, rgion, dstrict, yer) {
        this.personName = name;
        this.schoolName = school;
        this.scoreNum = score;
        this.placeNum = place;
        this.scoreEvent = event;
        this.region = dstrict;
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