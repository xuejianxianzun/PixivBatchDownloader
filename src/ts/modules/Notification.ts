import { settings } from './setting/Settings'

class SendNotification {
  constructor() {
    this.request()
  }

  private request() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission(function (status) {})
    }
  }

  public show() {}
}

const sendNotification = new SendNotification()
export { sendNotification }
