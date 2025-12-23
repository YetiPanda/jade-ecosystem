import { gql } from '@apollo/client';

/**
 * GraphQL queries and mutations for vendor order management
 */

export const GET_VENDOR_ORDERS = gql`
  query GetVendorOrders($input: OrdersQueryInput!) {
    vendorOrders(input: $input) {
      orders {
        id
        orderNumber
        status
        spaId
        spaName
        subtotal
        tax
        shipping
        total
        lineItemCount
        totalUnits
        createdAt
        confirmedAt
        shippedAt
        deliveredAt
        trackingNumber
        carrier
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_ORDER_DETAIL = gql`
  query GetOrderDetail($orderId: ID!) {
    vendorOrder(orderId: $orderId) {
      id
      orderNumber
      status
      spaId
      spaName
      subtotal
      tax
      shipping
      total
      lineItemCount
      totalUnits
      createdAt
      confirmedAt
      shippedAt
      deliveredAt
      trackingNumber
      carrier
      customerNotes
      vendorNotes

      lineItems {
        id
        productId
        productName
        variantName
        sku
        quantity
        unitPrice
        subtotal
        productImageUrl
      }

      shippingAddress {
        name
        businessName
        addressLine1
        addressLine2
        city
        state
        zipCode
        country
        phone
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      id
      status
      trackingNumber
      carrier
      vendorNotes
      shippedAt
      deliveredAt
    }
  }
`;

export const GET_ORDER_STATS = gql`
  query GetOrderStats {
    vendorOrderStats {
      totalOrders
      pendingOrders
      processingOrders
      shippedOrders
      totalRevenue
      averageOrderValue
    }
  }
`;
