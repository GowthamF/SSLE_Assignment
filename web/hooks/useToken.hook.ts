import useCookie from "react-use-cookie";
import { TOKEN_KEY } from "~/lib/constants";

const useToken = () => {
  return useCookie(TOKEN_KEY);
};

export default useToken;
