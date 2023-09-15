interface IAuthParam {
  email: string;
  password: string;
  user_type: string;
  browser_id: string;
  browser_name: string;
  browser_version: string;
}

interface IAuthResponse {
  name: string;
  email: string;
  token: string;
  user_type?: string; // added by front-end
  token_type: string;
  profile_image: string;
  refresh_token: string;
}

interface IForgetPasswordParam {
  email: string;
  user_type: string;
  request_type: 'FORGOT_PWD'; //'FORGOT_PWD'
}

interface IResetPWDParam {
  email: string;
  new_pwd: string;
  conf_pwd: string;
  user_type: string;
  identifier: string;
}

interface ICreatePWDParam {
  email: string;
  new_pwd: string;
  conf_pwd: string;
  user_type: string;
  identifier: string;
}

interface IQueryParamData {
  email: string;
  identifier: string;
}

interface IRegenerateTokenParam {
  browser_id: string;
  browser_name: string;
  refresh_token: string;
  browser_version: string;
}

interface IUnsubscribeParam {
  identifier: string;
  subscription_status: number;
  email: string;
}
