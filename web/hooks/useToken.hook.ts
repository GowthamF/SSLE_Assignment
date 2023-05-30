import { useCookies } from "react-cookie";
import { TOKEN_KEY } from "~/lib/constants";

const useToken = () => {
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_KEY]);

  const setToken = (token: string) => {
    setCookie("token", token);
  };

  const removeToken = () => {
    removeCookie("token");
  };

  return [cookies.token, setToken, removeToken] as const;
};

export default useToken;
