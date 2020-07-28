# Calendair

A Vue 3 Datepicker inspired by Airbnb's [react-dates](https://github.com/airbnb/react-dates).

## Install

### Package Manager

```sh
npm install calendair --save
```

### CDN

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/bounoable/calendair"></script>
```

## Usage

```ts
import { defineComponent, reactive } from 'vue'
import { Calendair, Options } from 'calendair'

export default {
  components: { Calendair },

  setup() {
    const options: Options = reactive({
      /* Calendar options */
    })

    return { options }
  }
}
```

```html
<Calendair :options="options"/>
```

## Booking Plugin

The Booking Plugin adds functionality that is needed for booking / reservation related apps. It handles blocked periods, minimum stay, check-in / check-out days & booking gaps.

### Install

```sh
npm install calendair @calendair/booking --save
```

### Use

```html
<script>
import { reactive } from 'vue'
import { Calendair, Options } from 'calendair'
import BookingPlugin from '@calendair/booking'

export default {
  components: { Calendair },

  setup() {
    const options: Options = reactive({
      plugins: [
        BookingPlugin({
          /**
           * Disable all dates / date ranges except the provided ones.
           */
          enabled?: Array<Date|[Date, Date]>|(() => Array<Date|[Date, Date]>)
          
          /**
           * Disable dates / date ranges.
           */
          disabled?: Array<Date|[Date, Date]>|(() => Array<Date|[Date, Date]>)

          /**
           * Already blocked periods (bookings).
           */
          blocked?: [Date, Date][]

          /**
           * Specify the selectable weekdays. Defaults to all if none provided.
           * Can provide an array of configurations for different periods.
           * 0 = Sunday, 6 = Saturday
           */
          selectableWeekdays?: Array<number|{
            period: [Date, Date]
            weekdays: number[]
          }>

          /**
           * Minimum days that have to be selected.
           */
          minDays?: number|((date: Date) => number)

          /**
           * Maximum gap between two bookings.
           */
          maxGap?: number|((date: Date) => number)

          /**
           * Allow overlapping of two bookings (check-in same as check-out).
           */
          allowOverlap?: boolean

          /**
           * Allow gaps between bookings to be filled, if otherwise the
           * gap could not be filled because of the minDays constraint.
           */
          allowGapFill?: boolean
        })
      ]
    })

    return { options }
  }
}
</script>

<template>
  <Calendair :options="options"/>
</template>
```

## Highlight plugin

The highlight plugin allows you to highlight certain dates in the calendar.
You can either highlight a static array of dates or provide a function to determine if a date should be highlighted.

### Install

```sh
npm install calendair @calendair/highlight --save
```

### Use

```html
<script>
import { reactive } from 'vue'
import { Calendair, Options } from 'calendair'
import HighlightPlugin from '@calendair/highlight'

export default {
  components: { Calendair },

  setup() {
    const options: Options = reactive({
      plugins: [
        HighlightPlugin({
          /**
           * The highlighted dates.
           */
          highlights?: Date[]|((date: Date) => boolean)

          /**
           * CSS style of the highlighted dates.
           */
          style?: Partial<CSSStyleDeclaration>
        }),
      ],
    })

    return { options }
  }
}
</script>

<template>
  <Calendair :options="options">
</template>
```
