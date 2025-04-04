import { StyleSheet } from "react-native";

export default StyleSheet.create({
  fintrackBanner: {
    height: 278,
    width: 490,
    position: "absolute",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1D3D47",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: "50%",
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
  },
});
