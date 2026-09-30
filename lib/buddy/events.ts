export type BuddyState = 
  | 'IDLE'
  | 'BOOTING'
  | 'GREETING'
  | 'PRESSED'
  | 'CLICKED'
  | 'LISTENING'
  | 'THINKING'
  | 'DRAGGING'
  | 'REBOOTING'
  | 'LOADING_MAP'
  | 'LOADING_REVIEWS'
  | 'REVIEW_EXCITED'
  | 'RECOMMENDING'
  | 'FAVORITED'
  | 'EXPLAINING'
  | 'WEATHER_ALERT'
  | 'WEATHER_HELP'
  | 'ROUTE_CHANGED'
  | 'UTILITY'
  | 'DNA_MATCH'
  | 'POPULARITY'
  | 'SPECIAL_EVENT'
  | 'JOURNEY_ADD'

export type BuddyEventType = 
  | 'BUDDY_BOOT'
  | 'BUDDY_GREETING'
  | 'BUDDY_CLICK'
  | 'BUDDY_PRESS'
  | 'BUDDY_DRAG'
  | 'BUDDY_REBOOT'
  | 'BUDDY_MAP_LOADING'
  | 'BUDDY_REVIEWS_LOADING'
  | 'BUDDY_REVIEW_RESULT'
  | 'BUDDY_RECOMMENDATION'
  | 'BUDDY_FAVORITED'
  | 'BUDDY_EXPLAIN'
  | 'BUDDY_WEATHER_ALERT'
  | 'BUDDY_WEATHER_HELP'
  | 'BUDDY_ROUTE_CHANGED'
  | 'BUDDY_UTILITY'
  | 'BUDDY_DNA_MATCH'
  | 'BUDDY_POPULARITY'
  | 'BUDDY_SPECIAL_EVENT'
  | 'BUDDY_THINKING'
  | 'BUDDY_IDLE'
  | 'BUDDY_JOURNEY_ADD'

export interface BuddyEvent {
  type: BuddyEventType;
  payload?: any;
}

type BuddyEventListener = (event: BuddyEvent) => void;

class BuddyEventEmitter {
  private listeners: BuddyEventListener[] = [];

  subscribe(listener: BuddyEventListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  trigger(event: BuddyEvent) {
    this.listeners.forEach(listener => listener(event));
  }
}

export const buddyEvents = new BuddyEventEmitter();

export const triggerBuddyEvent = (event: BuddyEvent) => {
  buddyEvents.trigger(event);
};
