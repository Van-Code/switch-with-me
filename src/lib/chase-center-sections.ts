export interface Section {
  id: string
  number: string
  zone: string
  level: string
  path: string
  labelX: number
  labelY: number
}

export const chaseCenterSections: Section[] = [
  // LOWER BOWL - SIDELINE LEFT
  { id: 'sec-101', number: '101', zone: 'Lower Bowl Sideline', level: 'lower', path: 'M 100 300 L 140 280 L 140 340 L 100 360 Z', labelX: 120, labelY: 320 },
  { id: 'sec-102', number: '102', zone: 'Lower Bowl Sideline', level: 'lower', path: 'M 140 280 L 180 265 L 180 325 L 140 340 Z', labelX: 160, labelY: 302 },
  { id: 'sec-103', number: '103', zone: 'Lower Bowl Sideline', level: 'lower', path: 'M 180 265 L 220 255 L 220 315 L 180 325 Z', labelX: 200, labelY: 290 },
  { id: 'sec-104', number: '104', zone: 'Lower Bowl Corner', level: 'lower', path: 'M 220 255 L 260 250 L 260 310 L 220 315 Z', labelX: 240, labelY: 282 },
  { id: 'sec-105', number: '105', zone: 'Lower Bowl Corner', level: 'lower', path: 'M 260 250 L 300 248 L 300 308 L 260 310 Z', labelX: 280, labelY: 279 },
  
  // LOWER BOWL - BASELINE TOP
  { id: 'sec-106', number: '106', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 300 248 L 340 248 L 340 308 L 300 308 Z', labelX: 320, labelY: 278 },
  { id: 'sec-107', number: '107', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 340 248 L 380 248 L 380 308 L 340 308 Z', labelX: 360, labelY: 278 },
  { id: 'sec-108', number: '108', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 380 248 L 420 248 L 420 308 L 380 308 Z', labelX: 400, labelY: 278 },
  { id: 'sec-109', number: '109', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 420 248 L 460 248 L 460 308 L 420 308 Z', labelX: 440, labelY: 278 },
  { id: 'sec-110', number: '110', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 460 248 L 500 248 L 500 308 L 460 308 Z', labelX: 480, labelY: 278 },
  
  // LOWER BOWL - SIDELINE RIGHT
  { id: 'sec-111', number: '111', zone: 'Lower Bowl Corner', level: 'lower', path: 'M 500 248 L 540 250 L 540 310 L 500 308 Z', labelX: 520, labelY: 279 },
  { id: 'sec-112', number: '112', zone: 'Lower Bowl Corner', level: 'lower', path: 'M 540 250 L 580 255 L 580 315 L 540 310 Z', labelX: 560, labelY: 282 },
  { id: 'sec-113', number: '113', zone: 'Lower Bowl Sideline', level: 'lower', path: 'M 580 255 L 620 265 L 620 325 L 580 315 Z', labelX: 600, labelY: 290 },
  { id: 'sec-114', number: '114', zone: 'Lower Bowl Sideline', level: 'lower', path: 'M 620 265 L 660 280 L 660 340 L 620 325 Z', labelX: 640, labelY: 302 },
  { id: 'sec-115', number: '115', zone: 'Lower Bowl Sideline', level: 'lower', path: 'M 660 280 L 700 300 L 700 360 L 660 340 Z', labelX: 680, labelY: 320 },
  
  // LOWER BOWL - BASELINE BOTTOM
  { id: 'sec-116', number: '116', zone: 'Lower Bowl Sideline', level: 'lower', path: 'M 700 300 L 700 360 L 660 380 L 660 320 Z', labelX: 680, labelY: 340 },
  { id: 'sec-117', number: '117', zone: 'Lower Bowl Corner', level: 'lower', path: 'M 660 320 L 660 380 L 620 395 L 620 335 Z', labelX: 640, labelY: 357 },
  { id: 'sec-118', number: '118', zone: 'Lower Bowl Corner', level: 'lower', path: 'M 620 335 L 620 395 L 580 405 L 580 345 Z', labelX: 600, labelY: 370 },
  { id: 'sec-119', number: '119', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 580 345 L 580 405 L 540 410 L 540 350 Z', labelX: 560, labelY: 377 },
  { id: 'sec-120', number: '120', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 540 350 L 540 410 L 500 412 L 500 352 Z', labelX: 520, labelY: 381 },
  { id: 'sec-121', number: '121', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 500 352 L 500 412 L 460 412 L 460 352 Z', labelX: 480, labelY: 382 },
  { id: 'sec-122', number: '122', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 460 352 L 460 412 L 420 412 L 420 352 Z', labelX: 440, labelY: 382 },
  { id: 'sec-123', number: '123', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 420 352 L 420 412 L 380 412 L 380 352 Z', labelX: 400, labelY: 382 },
  { id: 'sec-124', number: '124', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 380 352 L 380 412 L 340 412 L 340 352 Z', labelX: 360, labelY: 382 },
  { id: 'sec-125', number: '125', zone: 'Lower Bowl Baseline', level: 'lower', path: 'M 340 352 L 340 412 L 300 412 L 300 352 Z', labelX: 320, labelY: 382 },
  { id: 'sec-126', number: '126', zone: 'Lower Bowl Corner', level: 'lower', path: 'M 300 350 L 300 410 L 260 405 L 260 345 Z', labelX: 280, labelY: 377 },
  { id: 'sec-127', number: '127', zone: 'Lower Bowl Corner', level: 'lower', path: 'M 260 345 L 260 405 L 220 395 L 220 335 Z', labelX: 240, labelY: 370 },
  { id: 'sec-128', number: '128', zone: 'Lower Bowl Sideline', level: 'lower', path: 'M 220 335 L 220 395 L 180 380 L 180 320 Z', labelX: 200, labelY: 357 },
  { id: 'sec-129', number: '129', zone: 'Lower Bowl Sideline', level: 'lower', path: 'M 180 320 L 180 380 L 140 360 L 140 300 Z', labelX: 160, labelY: 340 },
  
  // UPPER BOWL - SIDELINE LEFT
  { id: 'sec-201', number: '201', zone: 'Upper Bowl Sideline', level: 'upper', path: 'M 50 280 L 90 250 L 90 320 L 50 350 Z', labelX: 70, labelY: 300 },
  { id: 'sec-202', number: '202', zone: 'Upper Bowl Sideline', level: 'upper', path: 'M 90 250 L 130 230 L 130 300 L 90 320 Z', labelX: 110, labelY: 275 },
  { id: 'sec-203', number: '203', zone: 'Upper Bowl Sideline', level: 'upper', path: 'M 130 230 L 170 215 L 170 285 L 130 300 Z', labelX: 150, labelY: 257 },
  { id: 'sec-204', number: '204', zone: 'Upper Bowl Corner', level: 'upper', path: 'M 170 215 L 210 205 L 210 275 L 170 285 Z', labelX: 190, labelY: 245 },
  { id: 'sec-205', number: '205', zone: 'Upper Bowl Corner', level: 'upper', path: 'M 210 205 L 250 200 L 250 270 L 210 275 Z', labelX: 230, labelY: 237 },
  
  // UPPER BOWL - BASELINE TOP
  { id: 'sec-206', number: '206', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 250 200 L 290 198 L 290 268 L 250 270 Z', labelX: 270, labelY: 234 },
  { id: 'sec-207', number: '207', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 290 198 L 330 198 L 330 268 L 290 268 Z', labelX: 310, labelY: 233 },
  { id: 'sec-208', number: '208', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 330 198 L 370 198 L 370 268 L 330 268 Z', labelX: 350, labelY: 233 },
  { id: 'sec-209', number: '209', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 370 198 L 410 198 L 410 268 L 370 268 Z', labelX: 390, labelY: 233 },
  { id: 'sec-210', number: '210', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 410 198 L 450 198 L 450 268 L 410 268 Z', labelX: 430, labelY: 233 },
  { id: 'sec-211', number: '211', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 450 198 L 490 198 L 490 268 L 450 268 Z', labelX: 470, labelY: 233 },
  { id: 'sec-212', number: '212', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 490 198 L 530 198 L 530 268 L 490 268 Z', labelX: 510, labelY: 233 },
  
  // UPPER BOWL - SIDELINE RIGHT
  { id: 'sec-213', number: '213', zone: 'Upper Bowl Corner', level: 'upper', path: 'M 530 198 L 570 200 L 570 270 L 530 268 Z', labelX: 550, labelY: 234 },
  { id: 'sec-214', number: '214', zone: 'Upper Bowl Corner', level: 'upper', path: 'M 570 200 L 610 205 L 610 275 L 570 270 Z', labelX: 590, labelY: 237 },
  { id: 'sec-215', number: '215', zone: 'Upper Bowl Sideline', level: 'upper', path: 'M 610 205 L 650 215 L 650 285 L 610 275 Z', labelX: 630, labelY: 245 },
  { id: 'sec-216', number: '216', zone: 'Upper Bowl Sideline', level: 'upper', path: 'M 650 215 L 690 230 L 690 300 L 650 285 Z', labelX: 670, labelY: 257 },
  { id: 'sec-217', number: '217', zone: 'Upper Bowl Sideline', level: 'upper', path: 'M 690 230 L 730 250 L 730 320 L 690 300 Z', labelX: 710, labelY: 275 },
  
  // UPPER BOWL - BASELINE BOTTOM
  { id: 'sec-218', number: '218', zone: 'Upper Bowl Sideline', level: 'upper', path: 'M 730 320 L 730 250 L 750 280 L 750 350 Z', labelX: 740, labelY: 300 },
  { id: 'sec-219', number: '219', zone: 'Upper Bowl Corner', level: 'upper', path: 'M 690 300 L 730 320 L 730 390 L 690 370 Z', labelX: 710, labelY: 345 },
  { id: 'sec-220', number: '220', zone: 'Upper Bowl Corner', level: 'upper', path: 'M 650 285 L 690 300 L 690 370 L 650 355 Z', labelX: 670, labelY: 327 },
  { id: 'sec-221', number: '221', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 610 275 L 650 285 L 650 355 L 610 345 Z', labelX: 630, labelY: 315 },
  { id: 'sec-222', number: '222', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 570 270 L 610 275 L 610 345 L 570 340 Z', labelX: 590, labelY: 307 },
  { id: 'sec-223', number: '223', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 530 268 L 570 270 L 570 340 L 530 338 Z', labelX: 550, labelY: 304 },
  { id: 'sec-224', number: '224', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 490 268 L 530 268 L 530 338 L 490 338 Z', labelX: 510, labelY: 303 },
  { id: 'sec-225', number: '225', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 450 268 L 490 268 L 490 338 L 450 338 Z', labelX: 470, labelY: 303 },
  { id: 'sec-226', number: '226', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 410 268 L 450 268 L 450 338 L 410 338 Z', labelX: 430, labelY: 303 },
  { id: 'sec-227', number: '227', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 370 268 L 410 268 L 410 338 L 370 338 Z', labelX: 390, labelY: 303 },
  { id: 'sec-228', number: '228', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 330 268 L 370 268 L 370 338 L 330 338 Z', labelX: 350, labelY: 303 },
  { id: 'sec-229', number: '229', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 290 268 L 330 268 L 330 338 L 290 338 Z', labelX: 310, labelY: 303 },
  { id: 'sec-230', number: '230', zone: 'Upper Bowl Baseline', level: 'upper', path: 'M 250 270 L 290 268 L 290 338 L 250 340 Z', labelX: 270, labelY: 304 },
  { id: 'sec-231', number: '231', zone: 'Upper Bowl Corner', level: 'upper', path: 'M 210 275 L 250 270 L 250 340 L 210 345 Z', labelX: 230, labelY: 307 },
  { id: 'sec-232', number: '232', zone: 'Upper Bowl Corner', level: 'upper', path: 'M 170 285 L 210 275 L 210 345 L 170 355 Z', labelX: 190, labelY: 315 },
  { id: 'sec-233', number: '233', zone: 'Upper Bowl Sideline', level: 'upper', path: 'M 130 300 L 170 285 L 170 355 L 130 370 Z', labelX: 150, labelY: 327 },
  { id: 'sec-234', number: '234', zone: 'Upper Bowl Sideline', level: 'upper', path: 'M 90 320 L 130 300 L 130 370 L 90 390 Z', labelX: 110, labelY: 345 },
]