export const mockHandleCollecyPaymentsResponse = {
  creditNotesActions: [
    {
      container: 'credit-notes',
      createdAt: '2023-03-15T18:20:09.377Z',
      id: '71b91470-86bb-41fc-9b88-3acdf0ccf2cf',
      key: 'key',
      lastModifiedAt: '2023-03-15T18:20:09.377Z',
      value: { documentId: 'documentId', dteNumber: 'dteNumber', dteType: 'NTC', grossAmount: { centAmount: 1234, currency: 'CLP' }, state: 'Closed' },
      version: 2
    }
  ],
  orderActions: [
    {
      actions: [
        { action: 'setDeliveryCustomField', deliveryId: 'delivery-1', name: 'owedAmount', value: { centAmount: 0, currencyCode: 'CLP' } },
        { action: 'addPayment', payment: { id: '1', typeId: 'payment' } },
        { action: 'setDeliveryCustomField', deliveryId: 'delivery-1', name: 'paymentInfo', value: ['payment-paid', '1'] },
        { action: 'addPayment', payment: { id: '2', typeId: 'payment' } },
        { action: 'removePayment', payment: { id: 'payment-pending', typeId: 'payment' } },
        { action: 'setDeliveryCustomField', deliveryId: 'delivery-2', name: 'owedAmount', value: { centAmount: 500, currencyCode: 'CLP' } },
        { action: 'addPayment', payment: { id: '4', typeId: 'payment' } },
        { action: 'addPayment', payment: { id: '3', typeId: 'payment' } },
        { action: 'setDeliveryCustomField', deliveryId: 'delivery-2', name: 'paymentInfo', value: ['payment-paid', '2', '4', '3'] }
      ],
      orderId: 'order-1',
      version: 1
    }
  ],
  paymentActions: [
    {
      actions: [
        { action: 'setCustomField', name: 'associatedDocs', value: '[{"dteNumber":"dte1","amount":500,"isPartial":false}]' },
        { action: 'setCustomField', name: 'paymentDate', value: '2023-10-01' },
        { action: 'transitionState', state: { key: 'PaymentPaid', typeId: 'state' } },
        { action: 'setCustomField', name: 'salesRepRUT', value: 'salesRepRUT' },
        { action: 'setCustomField', name: 'collectedBy', value: 'salesRepUserName' }
      ],
      paymentId: '1',
      version: 1
    },
    {
      actions: [
        { action: 'setCustomField', name: 'associatedDocs', value: '[{"documentId":"documentId","dteType":"NTC","dteNumber":"dteNumber","amount":500,"isPartial":true}]' },
        { action: 'setCustomField', name: 'paymentDate', value: '2023-10-01' },
        { action: 'transitionState', state: { key: 'PaymentPaid', typeId: 'state' } },
        { action: 'setCustomField', name: 'salesRepRUT', value: 'salesRepRUT' },
        { action: 'setCustomField', name: 'collectedBy', value: 'salesRepUserName' }
      ],
      paymentId: '2',
      version: 2
    },
    {
      actions: [
        { action: 'setCustomField', name: 'associatedDocs', value: '[{"dteNumber":"dte2","amount":1000,"isPartial":true}]' },
        { action: 'setCustomField', name: 'paymentDate', value: '2023-10-01' },
        { action: 'transitionState', state: { key: 'PaymentPaid', typeId: 'state' } },
        { action: 'setCustomField', name: 'salesRepRUT', value: 'salesRepRUT' },
        { action: 'setCustomField', name: 'collectedBy', value: 'salesRepUserName' }
      ],
      paymentId: '3',
      version: 3
    },
    { actions: [{ action: 'transitionState', state: { key: 'PaymentCancelled', typeId: 'state' } }], paymentId: 'payment-pending', version: 1 }
  ]
};
