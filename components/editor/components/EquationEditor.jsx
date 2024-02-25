import * as React from 'react'
import { forwardRef } from 'react'
import { Textarea } from '../../ui/textarea'
import { Input } from '../../ui/input'

// eqution editor component
function EquationEditor({ equation, setEquation, inline }, ref) {
  const onChange = (event) => {
    setEquation(event.target.value)
  }

  return inline && ref instanceof HTMLInputElement ? (
    <span className="EquationEditor_inputBackground">
      <span className="text-left">$</span>
      <Input
        type="text"
        className="p-0 border-0 outline-0 resize-none"
        onChange={onChange}
        value={equation}
        autoFocus={true}
        ref={ref}
      />
      <span className="text-left">$</span>
    </span>
  ) : (
    <div className="EquationEditor_inputBackground">
      <span className="text-left">{'$$\n'}</span>
      <Textarea
        className="p-0 border-0 outline-0 resize-none"
        value={equation}
        onChange={onChange}
        ref={ref}
      />
      <span className="text-left">{'\n$$'}</span>
    </div>
  )
}

export default forwardRef(EquationEditor)
