import { defineComponent, h, Prop } from 'vue'

export default defineComponent({
  props: {
    date: { type: Date, required: true } as Prop<Date>
  },

  setup(props) {
    return () =>
      h(
        'span',
        {
          style: {
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '30',
            display: 'flex',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center'
          }
        },
        props.date!.getDate()
      )
  }
})
