export function GET_GROUP(addr) {
  return `query  {
        groupCreations (where: { creator: "${addr}" }) {
        id
        groupName
        creator
        }
    }`;
}

export function GET_RAISEPAY(addr) {
  return `query {
        raisePayments(where: { creator: "${addr}" }) {
            id
            amount
            message
            creator
            amountRaised
            status
            deadline
          }
            }`;
}

export function GET_PAYLINK(addr) {
  return `query {
        userPayments(where: { creator: "${addr}" }) {
            id
            amount
            message
            creator
            status
            payer   
            }
              }`;
}

export function GET_REQUEST_SENT(addr) {
  return `query {
        requestUserEvents(where: { creator: "${addr}" }) {
            id
            amount
            user
            creator
            status
              }
                }`;
}

export function GET_REQUEST_RECEIVED(addr) {
  return `query {
          requestUserEvents(where: { user: "${addr}" }) {
              id
              amount
              user
              creator
              status
                }
                  }`;
}

export function GET_PAYLINK2(id) {
  return `query {
          userPayments(where: { id: "${id}" }) {
              id
              amount
              message
              creator
              status
              payer   
              }
                }`;
}

export function GET_RAISEPAY2(id) {
  return `query {
          raisePayments(where: { id: "${id}" }) {
              id
              amount
              message
              creator
              amountRaised
              status
              deadline
            }
              }`;
}
