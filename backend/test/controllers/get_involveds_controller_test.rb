require "test_helper"

class GetInvolvedsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @get_involved = get_involveds(:one)
  end

  test "should get index" do
    get get_involveds_url, as: :json
    assert_response :success
  end

  test "should create get_involved" do
    assert_difference("GetInvolved.count") do
      post get_involveds_url, params: { get_involved: { date: @get_involved.date, description: @get_involved.description, location: @get_involved.location, phone: @get_involved.phone, summary: @get_involved.summary, time: @get_involved.time, title: @get_involved.title } }, as: :json
    end

    assert_response :created
  end

  test "should show get_involved" do
    get get_involved_url(@get_involved), as: :json
    assert_response :success
  end

  test "should update get_involved" do
    patch get_involved_url(@get_involved), params: { get_involved: { date: @get_involved.date, description: @get_involved.description, location: @get_involved.location, phone: @get_involved.phone, summary: @get_involved.summary, time: @get_involved.time, title: @get_involved.title } }, as: :json
    assert_response :success
  end

  test "should destroy get_involved" do
    assert_difference("GetInvolved.count", -1) do
      delete get_involved_url(@get_involved), as: :json
    end

    assert_response :no_content
  end
end
