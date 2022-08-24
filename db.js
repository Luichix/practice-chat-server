module.exports = {
  messages: [
    { id: 1, title: 'Lorem Ipsum', views: 254, user_id: 123 },
    { id: 2, title: 'Sic Dolor amet', views: 65, user_id: 456 },
  ],
  users: [
    { id: 123, name: 'John Doe' },
    { id: 456, name: 'Jane Doe' },
  ],
  rooms: [
    {
      id: 987,
      message_id: 1,
      body: 'Consectetur adipiscing elit',
      date: new Date('2017-07-03'),
    },
    {
      id: 995,
      message_id: 1,
      body: 'Nam molestie pellentesque dui',
      date: new Date('2017-08-17'),
    },
  ],
  clientesActivos: [
    {
      uid: '123',
      nombre: 'name',
      empresa: 'business',
      usuario: [
        {
          cliente: 'client', // whatsapp - web (id temporal) (telefono)
          agente: 'agent',
          estado: 'state',
        },
      ],
    },
  ],
  Mensaje: [
    {
      cid: 'cid', // id del mensaje
      rid: 'rid', // id de la sala
      uid: 'uid', // id del usuario
      euid: 'euid', // numero de telefono / valor aleatorio
      aid: 'aid', // id
      agente: 'agent', // nombre del agente
      nombre: 'name',
      empresa: 'enterprise',
      canal: 'channel',
      fecha: 'date',
      text: 'text',
    },
  ],
  ChatRoom: [
    {
      mid: '',
      rid: '',
      uid: '',
      nombre: '',
      empresa: '',
      canal: '',
    },
  ],
}
