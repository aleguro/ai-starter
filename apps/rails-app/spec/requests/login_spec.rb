require "rails_helper"

RSpec.describe "Login / logout" do
  let!(:user) { User.create!(name: "Alejandro", email: "ale@example.com", password: "password123") }

  describe "POST /login" do
    it "returns a JWT in the Authorization header for valid credentials" do
      post "/login", params: { user: { email: "ale@example.com", password: "password123" } }

      expect(response).to have_http_status(:ok)
      expect(response.headers["Authorization"]).to match(/^Bearer /)
    end

    it "returns 401 for wrong credentials" do
      post "/login", params: { user: { email: "ale@example.com", password: "wrong" } }

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /me" do
    it "returns the current user for a valid token" do
      post "/login", params: { user: { email: "ale@example.com", password: "password123" } }
      token = response.headers["Authorization"]

      get "/me", headers: { "Authorization" => token }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["email"]).to eq("ale@example.com")
    end

    it "returns 401 without a token" do
      get "/me"

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /logout" do
    it "revokes the JWT so it can no longer be used on a protected endpoint" do
      post "/login", params: { user: { email: "ale@example.com", password: "password123" } }
      token = response.headers["Authorization"]

      delete "/logout", headers: { "Authorization" => token }
      expect(response).to have_http_status(:no_content)

      get "/me", headers: { "Authorization" => token }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
