import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import axios from "axios";

import Screen from "../components/Screen";
import AppPicker from "../components/AppPicker";
import Toggle from "../components/Toggle";
import AppDisplayBox from "../components/AppDisplayBox";
import AppButton from "../components/AppButton";
import CourtDisplayText from "../components/CourtDisplayText";
import { times } from "../components/times";
import AppBoxButton from "../components/AppBoxButton";
import { computeTimes } from "../functions/computeTimes";

function TennisBooking() {
  const [time, setTime] = useState();
  const [isSingles, setIsSingles] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    const fetchCourts = async () => {
      if (time && selectedDate && isSingles !== null) {
        try {
          const { startTime, endTime } = computeTimes(
            selectedDate,
            time,
            isSingles
          );
          //toISOString() converts this value to a string so in the backend, it needs to converted back to a date Object.
          const response = await axios.get(
            `http://192.168.0.16:3000/api/tennisCourts?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`
          );
          setCourts(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchCourts();
  }, [time, isSingles, selectedDate]);

  const handlePost = async () => {
    try {
      const { startTime, endTime } = computeTimes(
        selectedDate,
        time,
        isSingles
      );
      await axios.post("http://192.168.0.16:3000/api/tennisCourts/bookings", {
        startTime: startTime,
        endTime: endTime,
        courtId: selectedCourt._id,
      });
      console.log("Booking added successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <AppBoxButton
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        ></AppBoxButton>
        <AppPicker
          icon={"clock-outline"}
          items={times}
          placeholder={"Select a start time"}
          selectedItem={time}
          onSelectItem={(item) => setTime(item)}
        ></AppPicker>
        <Toggle isSingles={isSingles} setIsSingles={setIsSingles}></Toggle>
        <AppDisplayBox marginTop={20} marginBottom={20}>
          {courts.map((court) => (
            <CourtDisplayText
              key={court._id}
              court={court}
              setSelectedCourt={setSelectedCourt}
              selectedCourt={selectedCourt}
            ></CourtDisplayText>
          ))}
        </AppDisplayBox>
        <AppButton title={"Book Now"} color="primary" onPress={handlePost} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 10 },
});

export default TennisBooking;