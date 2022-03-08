;('use strict')
window.onload = function (event) {
	const getData = async (url) => {
		let res = await fetch(url)
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status : ${res.status}`)
		}
		return await res.json()
	}

	//Карточка портфолио - portfolio card
	const secondElement = document.querySelector(
		'.portfolio__content .portfolio__card',
	)

	/**
	 * Заполнение и вывод карточек портфолио - Filling out and displaying portfolio cards
	 * @param {*} element - обьект с данными карточки - card data object
	 * @param {*} container - контайнер для вывода карточки - container for card output
	 * @param {*} tipe - тип карточки - card type
	 * @param {*} position - позиция карточки - card position
	 */
	const renderContentCard = (element, container) => {
		let clone = secondElement.cloneNode(true)

		let mainImg =
			clone.querySelector('.portfolio__card--image').getAttribute('data-src') +
			element['preview']
		clone.querySelector('.portfolio__card--image').setAttribute('src', mainImg)

		let title = clone.querySelector('.portfolio__card-title')
		title.textContent = element['main-title']

		element['is-darken']
			? title.classList.add('hover-white')
			: title.classList.add('hover-black')

		clone.style.display = 'inline-block'
		container.append(clone)
	}

	getData('./portfolio_file/portfolio.json')
		.then((data) => {
			const container = document.querySelector('.portfolio__tab #web-design')
			data['Web Design'].forEach((element) => {
				renderContentCard(element, container)
			})
		})
		.finally(() => {
			let x, y
			const imgConteiner = document.querySelector('.portfolio_card-move')
			let mainImgSrc = null
			let lastImg = null

			function rotate(elem, xpos, ypos) {
				const elemPosX = elem.offsetLeft
				const elemPosY = elem.offsetTop + elem.offsetHeight / 2

				// Distance between cursor and element
				const distance = Math.sqrt(
					Math.pow(xpos - elemPosX, 2) + Math.pow(ypos - elemPosY, 2),
				)
				// left or right?
				const multiplier = xpos - elemPosX > 0 ? 1 : -1
				const degree = ((distance < 20 ? distance : 20) * multiplier) / 2

				elem.style.transform = 'rotate(' + (3 + degree) + 'deg)'
			}

			function move(elem, xpos, ypos) {
				let x = xpos - 373
				if (x < 0) {
					x = 0
				} else if (x + 746 > window.innerWidth) {
					x = window.innerWidth - 780
				}

				// Change timeout param to operate delay
				setTimeout(
					(elem, x, ypos) => {
						/**
						 * We use nested timeout here to calculate distance in a right way
						 * When timeouts are in sequental order, distance between cursor
						 * and an image is always ~1-2px, because image is following cursor quickly.
						 */
						setTimeout(rotate, 75, imgConteiner, x, ypos)
						elem.style.left = x + 'px'
						elem.style.top = ypos - elem.offsetHeight / 2 + 'px'
					},
					80,
					elem,
					x,
					ypos,
				)
			}

			function movep(e) {
				if (imgConteiner) {
					move(imgConteiner, e.pageX, e.pageY)
				}
			}
			function leave(e) {
				imgConteiner.querySelector('img').classList.remove('show')
			}

			function enter(e) {
				let node = e.target.parentNode.parentNode
				let mainImg = node.querySelector('.portfolio__card--image')
				mainImgSrc = node
					.querySelector('.portfolio__card--image')
					.getAttribute('src')

				imgConteiner.style.top = y
				imgConteiner.style.left = x

				if (mainImg != lastImg) {
					lastImg = mainImg
					imgConteiner.querySelector('img').classList.remove('show')
				}
				setTimeout(() => {
					if (!imgConteiner.classList.contains('show')) {
						imgConteiner.classList.add('show')
						imgConteiner.querySelector('img').setAttribute('src', mainImgSrc)
						imgConteiner.querySelector('img').classList.add('show')
					} else {
						imgConteiner.querySelector('img').setAttribute('src', mainImgSrc)
						imgConteiner.querySelector('img').classList.add('show')
					}
				}, 500)
			}

			let positionTop =
				document.querySelector('.portfolio-section').getBoundingClientRect()
					.top + window.pageYOffset
			let positionBot =
				document.querySelector('.portfolio-section').getBoundingClientRect()
					.height + positionTop

			if (window.innerWidth > 1080) {
				document
					.querySelector('.portfolio-section')
					.addEventListener('mousemove', movep)
				document
					.querySelector('.portfolio-section')
					.addEventListener('mouseleave', leave)

				document.querySelectorAll('.portfolio__card-title').forEach((item) => {
					item.addEventListener('mouseenter', enter)
				})

				document.addEventListener('scroll', (e) => {
					if (
						positionTop >
							window.pageYOffset + document.documentElement.clientHeight ||
						positionBot < window.pageYOffset
					) {
						imgConteiner.querySelector('img').classList.remove('show')
					}
				})
				document.addEventListener('mousemove', (e) => {
					if (e.pageY < positionTop || e.pageY > positionBot)
						imgConteiner.querySelector('img').classList.remove('show')
				})
			}
			window.addEventListener('resize', function () {
				if (window.innerWidth < 1080) {
					document
						.querySelector('.portfolio-section')
						.removeEventListener('mousemove', movep)
					document
						.querySelector('.portfolio-section')
						.removeEventListener('mouseleave', leave)
					document
						.querySelectorAll('.portfolio__card-title')
						.forEach((item) => {
							item.removeEventListener('mouseenter', enter)
						})
				} else {
					document
						.querySelector('.portfolio-section')
						.addEventListener('mousemove', movep)
					document
						.querySelector('.portfolio-section')
						.addEventListener('mouseleave', leave)

					document
						.querySelectorAll('.portfolio__card-title')
						.forEach((item) => {
							item.addEventListener('mouseenter', enter)
						})
				}
			})
		})
}
