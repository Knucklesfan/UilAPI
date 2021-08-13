class person {

    year;
    name;
    school;
    score;
    place;
    event;
    region;
    district;

    constructor(name, school, score, place, event, rgion, dstrict, yer) {
        this.name = name;
        this.school = school;
        this.score = parseInt(score);
        this.place = parseInt(place);
        this.event = event;
        this.region = parseInt(dstrict);
        this.district = rgion;
        this.year = yer;
}


toString() {
    return "Person {" +
        "personName='" + this.name + '\'' +
        ", schoolName='" + this.school + '\'' +
        ", scoreNum=" + this.score +
        ", placeNum=" + this.place +
        '}';
}
}

module.exports = {
    person
}