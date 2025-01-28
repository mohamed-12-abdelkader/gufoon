import { ChakraProvider, extendBaseTheme } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import Router from "./router/Router.jsx";
import "react-toastify/dist/ReactToastify.css";

// تخصيص الثيم
const theme = extendBaseTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router />
      <ToastContainer />
    </ChakraProvider>
  );
}

export default App;
