package com.knucklesfan.uilapi;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;

public class Person implements Serializable {
    public String year;
    public String personName;
    public String schoolName;
    public String scoreNum;
    public String placeNum;
    public String scoreEvent;
    public String region;
    public String district;

    public Person(String name, String school, int score, int place, String rgion, String dstrict) {
        personName = name;
        schoolName = school;
        scoreNum = String.valueOf(score);
        placeNum = String.valueOf(place);
        region = dstrict;
        district = rgion;

    }
    public Person(String name, String school, String score, String place, String rgion, String dstrict) {
        personName = name;
        schoolName = school;
        scoreNum = score;
        placeNum = place;
        region = dstrict;
        district = rgion;

    }
    public Person(String name, String school, String score, String place,String event, String rgion, String dstrict, String yer) {
        personName = name;
        schoolName = school;
        scoreNum = score;
        placeNum = place;
        scoreEvent = event;
        region = dstrict;
        district = rgion;
        year = yer;
    }


    @Override
    public String toString() {
        return "Person {" +
                "personName='" + personName + '\'' +
                ", schoolName='" + schoolName + '\'' +
                ", scoreNum=" + scoreNum +
                ", placeNum=" + placeNum +
                '}';
    }
    public JSONObject toJson() throws JSONException {
        JSONObject ar = new JSONObject();
        ar.put("name", personName);
        ar.put("school", schoolName);
        ar.put("score", scoreNum);
        ar.put("place", placeNum);
        ar.put("region", region);
        ar.put("district", district);
        ar.put("event", scoreEvent);
        ar.put("year", year);

        return ar;
    }

    public String getName() {
        return personName;
    }
}
