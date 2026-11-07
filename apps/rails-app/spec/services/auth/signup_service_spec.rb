require "rails_helper"

RSpec.describe Auth::SignupService do
  describe "#create" do
    it "persists a new user with the given attributes" do
      user, = described_class.new(name: "Alejandro", email: "ale@example.com", password: "password123").run(:create)

      expect(user).to be_persisted
      expect(user.email).to eq("ale@example.com")
      expect(user.name).to eq("Alejandro")
    end

    it "returns an unpersisted user with errors for invalid attributes" do
      user, = described_class.new(name: "Alejandro", email: "not-an-email", password: "short").run(:create)

      expect(user).not_to be_persisted
      expect(user.errors).not_to be_empty
    end
  end
end
