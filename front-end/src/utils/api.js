const API_BASE_URL = "http://localhost:3001";

async function fetchJson(url, options = {}, onCancel) {
  try {
    const response = await fetch(url, options);
    if (response.status === 204) {
      return null;
    }
    const responseData = await response.json();

    const payload = {
      ...responseData,
      status: response.status,
      statusText: response.statusText,
    };

    if (payload.error) {
      return Promise.reject({ ...payload });
    }
    console.log(payload);
    return payload;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

// Common headers for all requests
const headers = new Headers();
headers.append("Content-Type", "application/json");

// Get analytics data for a restaurant
export async function getAnalytics(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/analytics`
  );
  const options = { headers, signal, credentials: "include" };
  return await fetchJson(url, options, []);
}

// Get available tables for a restaurant
export async function getAvailableTables(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/table`
  );
  const options = { headers, signal, credentials: "include" };
  return await fetchJson(url, options, []);
}

// Assign a reservation to a table
export async function assignReservationToTable(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}/assign-table?tableId=${params.tableId}`
  );

  const options = {
    headers,
    credentials: "include",
    method: "PUT",
  };
  return await fetchJson(url, options, []);
}

// create menu
export async function createMenu(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/menu`
  );

  const options = {
    method: "POST",
    headers,
    credentials: "include",
  };
  return await fetchJson(url, options, []);
}

// Get menu details by restaurant ID
export async function getMenu(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/menu`
  );
  const options = { headers, signal, credentials: "include" };
  return await fetchJson(url, options, []);
}

// get all menuItems for a menu
export async function getAllMenuItems(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/menu/${params.menuId}/menuItem`
  );
  const options = { headers, signal, credentials: "include" };
  return await fetchJson(url, options, []);
}

// Get menu item details by ID
export async function getMenuItemById(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/menu/${params.menuId}/menuItem/${params.menuItemId}`
  );
  const options = { headers, signal, credentials: "include" };
  return await fetchJson(url, options, []);
}

// create menu item
export async function createMenuItem(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/menu/${params.menuId}/menuItem`
  );

  const options = {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ ...params.data }),
  };
  return await fetchJson(url, options, []);
}

// Update menu item details
export async function updateMenuItem(params) {
  console.log(params);

  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/menu/${params.menuId}/menuItem/${params.menuItemId}`
  );

  const options = {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({ ...params.data }),
  };
  return await fetchJson(url, options, []);
}

// Get reservation details by ID
export async function getReservationById(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}`
  );
  const options = { headers, signal, credentials: "include" };
  return await fetchJson(url, options, []);
}

// Update reservation details
export async function updateReservation(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}`
  );

  const options = {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({ ...params.data }),
  };
  return await fetchJson(url, options, []);
}

// Get restaurant details by ID
export async function getRestaurantById(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}`
  );
  const options = { headers, credentials: "include", signal };
  return await fetchJson(url, options, []);
}

// Update restaurant details
export async function updateRestaurant(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}`
  );

  const options = {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({ ...params.data }),
  };
  return await fetchJson(url, options, []);
}

// Get table details by ID
export async function getTableById(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/table/${params.tableId}`
  );
  const options = { headers, credentials: "include", signal };
  return await fetchJson(url, options, []);
}
// Update table details
export async function updateTable(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/table/${params.tableId}`
  );

  const options = {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({ ...params.data }),
  };
  return await fetchJson(url, options, []);
}

// Cancel a reservation
export async function cancelReservation({ restaurantId, reservationId }) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/reservations/${reservationId}/cancel`
  );
  const options = {
    method: "PUT",
    headers,
    credentials: "include",
  };
  return await fetchJson(url, options, []);
}

// Delete a reservation
export async function deleteReservation({ restaurantId, reservationId }) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/reservations/${reservationId}`
  );
  const options = {
    method: "DELETE",
    headers,
    credentials: "include",
  };
  return await fetchJson(url, options, []);
}

// Get user profile
export async function getProfile(signal) {
  const url = new URL(`${API_BASE_URL}/api/v1/profile`);
  const options = { headers, credentials: "include", signal };
  return await fetchJson(url, options, []);
}

// Create a new reservation
export async function createNewReservation(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations`
  );
  const options = {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ ...params.data }),
  };
  return await fetchJson(url, options, []);
}

// Create a new restaurant
export async function createNewRestaurant(params) {
  const url = new URL(`${API_BASE_URL}/api/v1/restaurants`);
  const options = {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ ...params }),
  };
  return await fetchJson(url, options, []);
}

// create new table

export async function createNewTable(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/table`
  );
  const options = {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ ...params.data }),
  };
  return await fetchJson(url, options, []);
}

// get all reservations for a restaurant
export async function getAllReservations(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations`
  );
  const options = { headers, credentials: "include", signal };
  return await fetchJson(url, options, []);
}

// get all restaurants for a user
export async function getAllRestaurants(signal) {
  const url = new URL(`${API_BASE_URL}/api/v1/restaurants`);
  const options = { headers, credentials: "include", signal };
  return await fetchJson(url, options, []);
}

// delete a restaurant
export async function deleteRestaurant({ restaurantId }) {
  const url = new URL(`${API_BASE_URL}/api/v1/restaurants/${restaurantId}`);
  const options = {
    method: "DELETE",
    headers,
    credentials: "include",
  };
  return await fetchJson(url, options, []);
}

// get all tables for a restaurant
export async function getAllTables(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/table`
  );
  const options = { headers, credentials: "include", signal };
  return await fetchJson(url, options, []);
}

// delete a table
export async function deleteTable(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/table/${params.tableId}`
  );
  const options = {
    method: "DELETE",
    headers,
    credentials: "include",
  };
  return await fetchJson(url, options, []);
}

// get all orders for a reservation
export async function getAllOrders(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}/order`
  );
  const options = { headers, credentials: "include", signal };
  return await fetchJson(url, options, []);
}

// get the latest order for a reservation (returns array, use [0] for latest)
export async function getOrderForReservation(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}/order`
  );
  const options = { headers, credentials: "include", signal };
  return await fetchJson(url, options, []);
}

// get bill for an order
export async function getBillForOrder(params, signal) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}/order/${params.orderId}/bill`
  );
  const options = { headers, credentials: "include", signal };
  return await fetchJson(url, options, []);
}

// generate bill for an order
export async function generateBillForOrder(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}/order/${params.orderId}/bill`
  );
  const options = {
    method: "POST",
    headers,
    credentials: "include",
  };
  return await fetchJson(url, options, []);
}

// make payment for a bill
export async function makePaymentForBill(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}/order/${params.orderId}/bill/${params.billId}/payment`
  );
  const options = {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ paymentMethod: params.paymentMethod }),
  };
  return await fetchJson(url, options, []);
}

// update order
export async function updateOrder(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}/order/${params.orderId}`
  );

  const options = {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({ orderItems: params.orderItems }),
  };
  return await fetchJson(url, options, []);
}

// create order
export async function createOrder(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}/order`
  );

  const options = {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ orderItems: params.orderItems }),
  };
  return await fetchJson(url, options, []);
}

// delete menu item
export async function deleteMenuItem(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/menu/${params.menuId}/menuItem/${params.menuItemId}`
  );
  const options = {
    method: "DELETE",
    headers,
    credentials: "include",
  };
  return await fetchJson(url, options, []);
}
// finalize an order
export async function finalizeOrder(params) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/restaurants/${params.restaurantId}/reservations/${params.reservationId}/order/${params.orderId}/complete`
  );
  const options = {
    method: "PUT",
    headers,
    credentials: "include",
  };
  return await fetchJson(url, options, []);
}

