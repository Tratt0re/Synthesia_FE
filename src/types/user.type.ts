export interface UserCreateRequest {
  browser_info?: Record<string, any>;
}

export interface UserUpdateRequest {
  browser_info?: Record<string, any>;
}

export interface UserResponse {
  id: string;
  browser_info?: Record<string, any>;
  created_at: string;
}
