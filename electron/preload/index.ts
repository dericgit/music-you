function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
@keyframes metronome {
    0% {
        animation-timing-function: cubic-bezier(0.7806,0.0715,0.8998,0.731);
        transform: translate(-10%) rotate(-20deg)
    }

    17.5% {
        animation-timing-function: cubic-bezier(0.484,0.3308,0.6853,0.6667);
        transform: translate(-6.18%) rotate(-12.36deg)
    }

    27.6% {
        animation-timing-function: cubic-bezier(0.0676,0.1836,0.0518,0.9433);
        transform: translate(2.48%) rotate(4.96deg)
    }

    50.1% {
        animation-timing-function: cubic-bezier(0.7773,0.0708,0.9008,0.735);
        transform: translate(10%) rotate(20deg)
    }

    67.6% {
        animation-timing-function: cubic-bezier(0.4888,0.331,0.6153,0.6674);
        transform: translate(6.16%) rotate(12.32deg)
    }

    80% {
        animation-timing-function: cubic-bezier(0.0801,0.2206,0.1357,0.9363);
        transform: translate(-4.57%) rotate(-9.14deg)
    }

    100% {
        transform: translate(-10%) rotate(-20deg)
    }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  animation: metronome 1s infinite linear;
  background: linear-gradient(45deg, #bfc9c1 0%, #bfc9c1 15%, transparent 15%, transparent 18%, #bfc9c1 10%);
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #404943;
  z-index: 9999;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

// setTimeout(removeLoading, 4999)