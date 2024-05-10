const EventEndpoint = `http://localhost:7001/events`

describe("Event API CRUD Tests", () => {
  let eventId
  let accessToken
  let userdata = {
    name: "Dan George",
    email: "dangeorge35@gmail.com",
    password: "Dannex35",
  }

  it("should login the user", () => {
    const credential = { email: userdata.email, password: userdata.password }
    cy.request("POST", `http://localhost:7001/auth`, credential).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.success).to.eq(true)
      expect(response.body).to.have.property("token")
      accessToken = response.body.token
    })
  })

  it("should create a new event", () => {
    cy.request({
      method: "POST",
      url: EventEndpoint,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        name: "Call the Queens",
        date: "2024-02-07",
        description: "blue",
        category: "Concert",
        availableAttendeesCount: "300",
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (
        response.status === 400 &&
        response.body.message === "This Event Record Already Existed"
      ) {
        eventId = response.body.data.id
      } else {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.eq(true)
        expect(response.body.data).to.have.property("id")
        eventId = response.body.data.id
      }
    })
  })

  it("should get an event by ID", () => {
    cy.request({
      method: "GET",
      url: `${EventEndpoint}/${eventId}`,
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.data).to.have.property("id", eventId)
    })
  })

  it("should search an event by name", () => {
    cy.request({
      method: "GET",
      url: `${EventEndpoint}/?name=Call the Queens`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.success).to.eq(true)
      const eventData = response.body.data.find((event) => event.name === "Call the Queens")
      expect(eventData).to.exist
      expect(eventData.id).to.eq(eventId)
      expect(eventData.name).to.eq("Call the Queens")
    })
  })

  it("should search an event by category", () => {
    cy.request({
      method: "GET",
      url: `${EventEndpoint}/?category=Concert`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.success).to.eq(true)
      const eventData = response.body.data.find((event) => event.name === "Call the Queens")
      expect(eventData).to.exist
      expect(eventData.id).to.eq(eventId)
      expect(eventData.name).to.eq("Call the Queens")
    })
  })

  it("should get users booked events by authorization", () => {
    cy.request({
      method: "GET",
      url: `${EventEndpoint}/booked`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.success).to.eq(true)
      expect(response.body).to.have.property("data")
    })
  })

  it("Reserve tickets for an event", () => {
    cy.request({
      method: "POST",
      url: `${EventEndpoint}/${eventId}/tickets`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        attendeesCount: "1",
      },
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.success).to.eq(true)
      expect(response.body.message).to.eq("Ticket Reserved Successfully")
    })
  })

  it("Cancle tickets for an event", () => {
    cy.request({
      method: "DELETE",
      url: `${EventEndpoint}/${eventId}/booked`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.success).to.eq(true)
      expect(response.body.message).to.eq("Successfully cancled the Event booking")
    })
  })
})
