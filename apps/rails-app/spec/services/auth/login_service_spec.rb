require "rails_helper"

RSpec.describe Auth::LoginService do
  let!(:user) { User.create!(name: "Alejandro", email: "ale@example.com", password: "password123") }

  describe "#authenticate" do
    it "returns the user for valid credentials" do
      found, = described_class.new(email: "ale@example.com", password: "password123").run(:authenticate)

      expect(found).to eq(user)
    end

    it "returns nil for a wrong password" do
      found, = described_class.new(email: "ale@example.com", password: "wrong").run(:authenticate)

      expect(found).to be_nil
    end

    it "returns nil for an unknown email" do
      found, = described_class.new(email: "nobody@example.com", password: "password123").run(:authenticate)

      expect(found).to be_nil
    end
  end
end
