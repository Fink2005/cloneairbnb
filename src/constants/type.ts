export const Role = {
    User: 'USER',
    Admin: 'ADMIN',
  } as const
  
  export const RoleValues = [Role.User, Role.Admin] as const

  export const RoomStatus = {
    Available: 'Available',
    Unavailable: 'Unavailable',
    Hidden: 'Hidden'
  } as const
  
  export const RoomStatusValues = [RoomStatus.Available, RoomStatus.Unavailable, RoomStatus.Hidden] as const

  export const OrderStatus = {
    Pending: 'Pending',
    Processing: 'Processing',
    Rejected: 'Rejected',
    Delivered: 'Delivered',
    Paid: 'Paid'
  } as const
  
  export const OrderStatusValues = [
    OrderStatus.Pending,
    OrderStatus.Processing,
    OrderStatus.Rejected,
    OrderStatus.Delivered,
    OrderStatus.Paid
  ] as const
  
  export const ManagerRoom = 'manager' as const