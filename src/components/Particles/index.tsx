import Particles from 'react-particles-js'

export const ParticlesCustom = () => {
  return <Particles
    className='particles'
    params={{
        particles: {
        number: {
            value: 50
        },
        size: {
            value: 3
        }
        },
        interactivity: {
        events: {
            onhover: {
            enable: true,
            mode: 'repulse'
            }
        }
        }
    }}
    />
}

export default ParticlesCustom
