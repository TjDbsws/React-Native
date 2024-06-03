import * as Location from 'expo-location';
import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { Dimensions, ScrollView, StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = "c9cf2ef804faa047b685cbd585887024";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [ city, setCity ] = useState("Loading...");
  const [ days, setDays ] = useState([]);
  const [ ok, setOk ] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if ( !granted ) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    setCity(location[0].city);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${ latitude }&lon=${ longitude }&exclude=alert&appid=${API_KEY}`
    );

    const json = await response.json();
    setDays(json.daily);
  };

    useEffect(() => {
      getWeather();
    }, []);

    return (
      <View style={ styles.container }>
        <View style={ styles.city }>
          <Text style={ styles.cityName }>{ city }</Text>
        </View>

        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={ false }
          contentContainerStyle={ styles.weather }
        >
          { days && days.length === 0 ? (
            <View style={ styles.day }>
              <ActivityIndicator
                color= "white"
                style= {{ marginTop: 10 }}
                size= "large"
              />
            </View>
          ) : (
            days && days.map((day, index) => (
              <View key={ index } style={{ ...styles.day, alignItems: "center" }}>
                <View
                  style={{ flexDirection: "row", alignItems:"center", justifyContent: "space-between", width: "100%" }}>
                  <Text style={ styles.temp }>
                    { parseFloat(day.temp.day).toFixed(1)}
                  </Text>
                  <Fontisto name={ icons[day.weather[0].main] } size={68} color="black" />
                </View>

                <Text style={ styles.description }>{day.weather[0].main}</Text> 
                <Text style={ styles.tinyText }>{day.weather[0].description}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A3C6C4',
  },

  city: {
    flex: 1.2,
    // backgroundColor: '#57648C',
    justifyContent: "center",
    alignItems: "center",
  },

  cityName: {
    color: "black",
    fontSize: 56,
    fontWeight: "500"
  },

  weather: {
    // 스크롤뷰는 화면보다 더 커야 하므로 flex 지정할 의미가 없다.
    // flex: 3, 이를 설정하게 되면 스크롤이 막히게 됨(비율을 지정했기 때문에)
    // backgroundColor: '#E0E7E9',
  },

  day: {
    // flex: 1, 전체 스크린 사이즈를 가져와야 함 -> 핸드폰 사이즈를 알려주는 API 이용
    width: SCREEN_WIDTH,
    // justifyContent: "center",
    alignItems: "left",
    // backgroundColor: '#934A5F',
  },

  temp: {
    marginTop: 50,
    fontSize: 170,
  },

  description: {
    marginTop: -15,
    fontSize: 35,
  },
})