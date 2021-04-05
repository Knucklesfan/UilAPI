package com.knucklesfan.uilapi;

import org.json.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.beans.XMLEncoder;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;

@SpringBootApplication
@RestController
public class UilApiApplication {
	@CrossOrigin
	public static void main(String[] args) {
		SpringApplication.run(UilApiApplication.class, args);
	}
	@CrossOrigin
	@GetMapping("/getEvents")
	public String getEvents() throws IOException, JSONException {
		JSONArray arg = new JSONArray();
		for(String s : getAllEvents()) {
			arg.put(s);
		}
		JSONArray ary = new JSONArray();
		for(String s : getEventTexts()) {
			ary.put(s);
		}
		JSONObject obj = new JSONObject();
		obj.put("events",arg);
		obj.put("words",ary);
		return obj.toString();
	}
	@CrossOrigin
	@GetMapping("/getScore")
	public String getScore(@RequestParam(value = "subject", defaultValue = "CSC") String name, @RequestParam(value = "region", defaultValue = "20") String region, @RequestParam(value = "conf", defaultValue = "2A") String conf, @RequestParam(value = "year", defaultValue = "2021") String year, @RequestParam(value = "district", defaultValue = "D") String district) throws IOException, JSONException {
		Document doc;
		if(Integer.parseInt(year) != 2021) {
			doc = Jsoup.connect("http://utdirect.utexas.edu/uil/vlcp_pub_arch.WBX?s_event_abbr=" + name + "?s_year="+ year +"&s_level_id=" + district + "&s_level_nbr=" + region + "&s_conference=" + conf + "&s_submit_sw=X&s_year="+year+"&s_conference="+conf+"&s_level_id="+region+"&s_gender=&s_round=&s_dept=C&s_area_zone=").get();
		}
		else {
			doc = Jsoup.connect("http://utdirect.utexas.edu/uil/vlcp_results.WBX?s_event_abbr=" + name + "?s_year="+ year +"&s_level_id=" + district + "&s_level_nbr=" + region + "&s_conference=" + conf + "&s_area_zone=&s_submit_sw=X").get();
		}
		// get page titlec
		// get all links
		JSONArray jsonArray = new JSONArray();
		Elements links = doc.getElementById("form1").children();
		for (Element e : links) {
			/**Elements eb = e.select("table");
			for (Element lm : eb) {
				Elements stuff = lm.select("tr");
				stuff.remove(0);
				for (Element child : stuff) {
					Elements pinecone = child.select("td");
					Person pers = new Person(pinecone.get(0).text(),
							pinecone.get(1).text(),
							pinecone.get(2).text(),
							pinecone.get(3).text());
					jsonArray.put(pers.toJson());
				}
			}**/
			Elements eb = e.select("table");
			for (Element lm : eb) {

				Elements stuff = lm.select("tr");
				stuff.remove(0);
				for (Element child : stuff) {
					Elements pinecone = child.select("td");
					if(!pinecone.get(1).text().matches("[0-9]+") && !pinecone.get(2).text().matches(".*[a-z].*")) {
						Person pers = new Person(pinecone.get(0).text(),
								pinecone.get(1).text(),
								pinecone.get(2).text(),
								pinecone.get(3).text(),
								"pinecone",
								region,
								conf
								);
						jsonArray.put(pers.toJson());
					}
				}
			}
		}
		JSONObject perWrapper = new JSONObject();
		perWrapper.put("people",jsonArray);
		return perWrapper.toString();
	}

	@CrossOrigin
	@GetMapping("/getAllScores")
	public String getIndividualScore(@RequestParam(value = "person", defaultValue = "Parker, Cade") String name, @RequestParam(value = "region", defaultValue = "20") String region, @RequestParam(value = "conf", defaultValue = "2A") String conf) throws IOException, JSONException {
		String[] events = getAllEvents();
		String[] eventWords = getEventTexts();
		ArrayList<Person> people = new ArrayList<>();
		for (int y = 1; y < events.length; y++) {
			people.add(getPerson(name, events[y], region, conf, eventWords[y]));
		}
		JSONArray retu = new JSONArray();
		for (Person e : people) {
			if (e != null) {
				retu.put(e.toJson());
			}
		}
		return retu.toString();
	}

	public static Person getPerson(String name, String event, String region, String conf, @Nullable String eventWords) throws JSONException, IOException {
		Document doc = Jsoup.connect("http://utdirect.utexas.edu/uil/vlcp_results.WBX?s_event_abbr=" + event + "?s_year=2021&s_meet_abbr=SPM&s_gender=&s_level_id=D&s_level_nbr=" + region + "&s_conference=" + conf + "&s_area_zone=&s_submit_sw=X").get();

		// get page title
		// get all links
		Elements links = doc.getElementById("form1").children();
		for (Element e : links) {
			Elements eb = e.select("table");
			for (Element lm : eb) {
				Elements stuff = lm.select("tr");
				stuff.remove(0);
				for (Element child : stuff) {
					Elements pinecone = child.select("td");
					Person pers = new Person(pinecone.get(0).text(),
							pinecone.get(1).text(),
							pinecone.get(2).text(),
							pinecone.get(3).text(),
							eventWords,
							region,
							conf

					);

					if (pers.getName().equals(name)) {
						return pers;
					}
				}
			}
		}
		return null;
	}

	private static String[] getAllEvents() throws IOException {
		Document doc = Jsoup.connect("http://utdirect.utexas.edu/uil/vlcp_results.WBX").get();
		Elements links = doc.selectFirst("select[name]").children();
		ArrayList<String> str = new ArrayList<>();
		for (Element e : links) {
			str.add(e.attr("value"));
		}
		return str.toArray(new String[0]);
	}


	private static String[] getEventTexts() throws IOException {
		Document doc = Jsoup.connect("http://utdirect.utexas.edu/uil/vlcp_results.WBX").get();
		Elements links = doc.selectFirst("select[name]").children();
		ArrayList<String> str = new ArrayList<>();
		for (Element e : links) {
			str.add(e.text());
		}
		return str.toArray(new String[0]);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("**/");
			}
		};
	}
}
