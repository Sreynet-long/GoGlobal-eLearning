import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const httpLink = new HttpLink({
  uri: "http://192.168.5.36:5210/graphql",
  // uri: "https://endpoint-goglobal-online-learning.go-globalit.com/graphql",
});


const authLink = setContext(async (_, { headers }) => {
  let token = null;
  if (Platform.OS === "web") token = localStorage.getItem("token");
  else token = await AsyncStorage.getItem("token");
  // console.log(token, "token Apollo")

  return {
    headers: {
      ...headers,
     authorization: token ? `${token}` : "", 
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
 
export default client;
