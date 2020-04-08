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
import { defineComponent, ref } from 'vue'
import { Calendair, Options } from 'calendair'

export default {
  components: { Calendair },

  data() {
    const options = ref<Options>({
      
    })

    return { options }
  }
}
```

```html
<Calendar :options="options"/>
```

## Booking Plugin

The Booking Plugin adds functionality that is needed for booking related apps. It handles blocked periods, minimum stay, check-in / check-out days & booking gaps.

### Install

```sh
npm install calendair @calendair/booking --save
```

```html
<script>
import { Calendair, Options } from 'calendair'
import BookingPlugin from '@calendair/booking'

export default {
  components: { Calendair },

  setup() {
    const options: Options = {
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
    }

    return { options }
  }
}
</script>

<template>
  <Calendar :options="options"/>
</template>
```
