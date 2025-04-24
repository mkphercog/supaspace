export type DbUserDataType = {
  id: string;
  created_at: string;
  nickname: string;
  nickname_updated_at: string | null;
  email: string;
  avatar_url: string;
  avatar_url_updated_at: string | null;
  full_name_from_auth_provider: string;
};
