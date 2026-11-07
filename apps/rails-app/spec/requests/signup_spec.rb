require "rails_helper"

RSpec.describe "POST /signup" do
  it "creates a user and returns a JWT in the Authorization header" do
    post "/signup", params: {
      user: { name: "Alejandro", email: "ale@example.com", password: "password123" }
    }

    expect(response).to have_http_status(:created)
    expect(response.headers["Authorization"]).to match(/^Bearer /)
    expect(User.find_by(email: "ale@example.com")).to be_present
  end

  it "returns 422 with validation errors for a duplicate email" do
    User.create!(name: "Existing", email: "ale@example.com", password: "password123")

    post "/signup", params: {
      user: { name: "Alejandro", email: "ale@example.com", password: "password123" }
    }

    expect(response).to have_http_status(:unprocessable_content)
    expect(JSON.parse(response.body)["errors"]).to include(a_string_matching(/email/i))
  end
end
