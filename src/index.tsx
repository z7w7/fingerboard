import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { uniqueId, times, isEmpty, minBy, maxBy, isArray } from 'lodash'
import './index.less'

const ANCHOR1: number[] = [3, 5, 7, 9, 15, 17] // 单品点
const ANCHOR2: number[] = [12] // 双品点
const STRINGS: number[] = times(6, Number) // 1~6弦，data.string从0开始
const FRETS: number[] = times(21, Number) // 0~20品，data.fret从0开始

interface PointProps {
  string: number,
  fret: number
}

interface FingerboardProps {
  data: PointProps[] | PointProps,
  className?: string,
  fretMark?: string | null,
  fretWidth?: number
}

const Fingerboard: React.FC<FingerboardProps> = (props) => {
  const {
    data,
    className = '',
    fretMark = 'default',
    fretWidth = 72
  } = props

  const fingerboardRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement[]>([]) // 品格的ref
  const [points, setPoints] = useState<PointProps[]>([]) // 提示点

  // data变化时，自动滚动指板，使提示点展示在视区中
  const autoScroll = (): void => {
    if (isEmpty(data)) {
      setPoints([])
      fingerboardRef.current?.scrollTo(0, 0)
      return
    }

    let minFret: number // 最小品
    let maxFret: number // 最大品
    if (isArray(data)) { // data 为数组
      setPoints(data)
      minFret = minBy(data, 'fret')?.fret || 0
      maxFret = maxBy(data, 'fret')?.fret || 0
    } else { // data 为对象
      setPoints([data])
      minFret = data.fret
      maxFret = data.fret
    }
    // 取整
    minFret = Math.floor(minFret)
    maxFret = Math.floor(maxFret)

    const minFretLeft: number = listRef.current[minFret].offsetLeft // 最小品的offsetLeft
    const maxFretLeft: number = listRef.current[maxFret].offsetLeft // 最大品的offsetLeft
    const { offsetWidth = 0, scrollLeft = 0 } = fingerboardRef.current || {} // 容器宽度、滚动left值

    // 品的宽度 + borderWidth * 2
    const blockWidth: number = fretWidth + 4
    // 超出容器右侧
    if (maxFretLeft > offsetWidth + scrollLeft - blockWidth) { // 减 blockWidth 是为了能展示完整的一品
      fingerboardRef.current?.scrollTo(maxFretLeft - offsetWidth + blockWidth, 0)
    }

    // 超出容器左侧
    if (minFretLeft < scrollLeft) {
      fingerboardRef.current?.scrollTo(minFretLeft, 0)
    }
  }

  useEffect(() => {
    autoScroll()
  }, [data, fretWidth])

  // 根据品号计算提示点的left值
  const calcLeft = (fret: number): string => {
    const { offsetLeft, offsetWidth } = listRef.current[fret]
    return `${offsetLeft + offsetWidth / 2}px`
  }

  // 计算容器的类名
  const calcCN = useCallback((): string => {
    let cn = 'z-fingerboard'
    cn += fretMark ? ' z-fingerboard--mark' : ''
    cn += className ? ` ${className}` : ''
    return cn
  }, [fretMark, className])

  // 渲染弦、品
  const renderMain = () => useMemo(() => (
    <>
      {/** 品 */}
      <div className='z-frets'>
        {
          FRETS.map((n: number) => (
            <div
              key={uniqueId('fret_')}
              className='z-frets__item'
              ref={(ele) => {
                ele && (listRef.current[n] = ele)
              }}
            >
              {/* 品格、品点 */}
              <div
                className={`z-frets__item__block${ANCHOR1.includes(n) ? ' anchor-single' : ''}${ANCHOR2.includes(n) ? ' anchor-double' : ''}`}
                style={n ? { width: `${fretWidth}px` } : {}}
              />

              {/* 品号 */}
              {
                fretMark === 'default'
                  ? ((ANCHOR1.includes(n) || ANCHOR2.includes(n)) && <div className='z-frets__item__mark'>{n}</div>)
                  : fretMark === 'all'
                    ? <div className='z-frets__item__mark'>{n}</div>
                    : null
              }
            </div>
          ))
        }
      </div>

      {/** 弦 */}
      <div className='z-strings'>
        {
          STRINGS.map(() => <div key={uniqueId('string_')} className='z-strings__item' />)
        }
      </div>
    </>
  ), [fretMark, fretWidth])

  return (
    <div className={calcCN()} ref={fingerboardRef}>
      <div className='z-fingerboard__content'>
        {renderMain()}

        {/** 提示点 */}
        {
          points.map((o: PointProps) => (
            <div
              key={uniqueId('point_')}
              className='z-point'
              style={{
                left: calcLeft(Math.floor(o.fret)),
                top: `${Math.floor(o.string) * 20}%`
              }}
            />
          ))
        }
      </div>
    </div>
  )
}

export default Fingerboard
