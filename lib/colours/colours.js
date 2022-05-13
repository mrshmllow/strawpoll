exports.colours = ['blue']

const required_classes = [
  'text-COLOUR-700',
  'text-COLOUR-600',
  'bg-COLOUR-600',
  'bg-COLOUR-700',
  'hover:bg-COLOUR-800',
  'focus:ring-COLOUR-300',
  'dark:bg-COLOUR-600',
  'dark:hover:bg-COLOUR-700',
  'dark:focus:ring-COLOUR-800',
]

exports.generate = () => {
  const list = []
  for (let i = 0; i < required_classes.length; i++) {
    const required = required_classes[i]

    for (let j = 0; j < exports.colours.length; j++) {
      const colour = exports.colours[j]

      list.push(required.replaceAll('COLOUR', colour))
    }
  }

  return list
}
