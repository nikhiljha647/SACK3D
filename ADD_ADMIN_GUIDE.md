ices, and obtaining access to those devices.
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIAccess)
 */
interface MIDIAccess extends EventTarget {
    /**
     * The **`inputs`** read-only property of the MIDIAccess interface provides access to any available MIDI input ports.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIAccess/inputs)
     */
    readonly inputs: MIDIInputMap;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIAccess/statechange_event) */
    onstatechange: ((this: MIDIAccess, ev: MIDIConnectionEvent) => any) | null;
    /**
     * The **`outputs`** read-only property of the MIDIAccess interface provides access to any available MIDI output ports.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIAccess/outputs)
     */
    readonly outputs: MIDIOutputMap;
    /**
     * The **`sysexEnabled`** read-only property of the MIDIAccess interface indicates whether system exclusive support is enabled on the current MIDIAccess instance.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIAccess/sysexEnabled)
     */
    readonly sysexEnabled: boolean;
    addEventListener<K extends keyof MIDIAccessEventMap>(type: K, listener: (this: MIDIAccess, ev: MIDIAccessEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MIDIAccessEventMap>(type: K, listener: (this: MIDIAccess, ev: MIDIAccessEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var MIDIAccess: {
    prototype: MIDIAccess;
    new(): MIDIAccess;
};

/**
 * The **`MIDIConnectionEvent`** interface of the Web MIDI API is the event passed to the MIDIAccess.statechange_event event of the MIDIAccess interface and the MIDIPort.statechange_event event of the MIDIPort interface.
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIConnectionEvent)
 */
interface MIDIConnectionEvent extends Event {
    /**
     * The **`port`** read-only property of the MIDIConnectionEvent interface returns the port that has been disconnected or connected.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIConnectionEvent/port)
     */
    readonly port: MIDIPort | null;
}

declare var MIDIConnectionEvent: {
    prototype: MIDIConnectionEvent;
    new(type: string, eventInitDict?: MIDIConnectionEventInit): MIDIConnectionEvent;
};

interface MIDIInputEventMap extends MIDIPortEventMap {
    "midimessage": MIDIMessageEvent;
}

/**
 * The **`MIDIInput`** interface of the Web MIDI API receives messages from a MIDI input port.
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIInput)
 */
interface MIDIInput extends MIDIPort {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIInput/midimessage_event) */
    onmidimessage: ((this: MIDIInput, ev: MIDIMessageEvent) => any) | null;
    addEventListener<K extends keyof MIDIInputEventMap>(type: K, listener: (this: MIDIInput, ev: MIDIInputEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MIDIInputEventMap>(type: K, listener: (this: MIDIInput, ev: MIDIInputEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var MIDIInput: {
    prototype: MIDIInput;
    new(): MIDIInput;
};

/**
 * The **`MIDIInputMap`** read-only interface of the Web MIDI API provides the set of MIDI input ports that are currently available.
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIInputMap)
 */
interface MIDIInputMap {
    forEach(callbackfn: (value: MIDIInput, key: string, parent: MIDIInputMap) => void, thisArg?: any): void;
}

declare var MIDIInputMap: {
    prototype: MIDIInputMap;
    new(): MIDIInputMap;
};

/**
 * The **`MIDIMessageEvent`** interface of the Web MIDI API represents the event passed to the MIDIInput.midimessage_event event of the MIDIInput interface.
 * Available only in secure contexts.
 *
 * [MDN Reference](https://develo