require "test_helper"

class ProductOffersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get product_offers_index_url
    assert_response :success
  end

  test "should get show" do
    get product_offers_show_url
    assert_response :success
  end

  test "should get create" do
    get product_offers_create_url
    assert_response :success
  end

  test "should get update" do
    get product_offers_update_url
    assert_response :success
  end

  test "should get destroy" do
    get product_offers_destroy_url
    assert_response :success
  end
end
