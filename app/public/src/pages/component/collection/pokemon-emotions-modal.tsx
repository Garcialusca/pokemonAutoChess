import React, { useCallback, useMemo } from "react"
import Modal from "react-bootstrap/esm/Modal"
import { useTranslation } from "react-i18next"
import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../../../../../models/precomputed"
import { Emotion } from "../../../../../types"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  buyBooster,
  buyEmotion,
  changeSelectedEmotion
} from "../../../stores/NetworkStore"
import { getPortraitSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import PokemonEmotion from "./pokemon-emotion"
import "./pokemon-emotions-modal.css"

export default function PokemonEmotionsModal(props: {
  pokemon: Pkm
  onHide: () => void
}) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const pokemonCollection = useAppSelector(
    (state) => state.lobby.pokemonCollection
  )

  const index = PkmIndex[props.pokemon]

  const availableEmotions: Emotion[] = Object.values(Emotion).filter(
    (e, i) => PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[index]?.[i] === 1
  )

  const pConfig = useMemo(() => {
    const foundPokemon = pokemonCollection.find((c) => c.id == index) ?? {
      dust: 0,
      emotions: [],
      shinyEmotions: [],
      selectedEmotion: Emotion.NORMAL,
      selectedShiny: false,
      id: "0000"
    }

    return foundPokemon
  }, [index, pokemonCollection])

  const handlePokemonEmotionClick = useCallback(
    (
      unlocked: boolean,
      update: { index: string; emotion: Emotion; shiny: boolean }
    ) => {
      if (unlocked) {
        dispatch(changeSelectedEmotion(update))
      } else {
        dispatch(buyEmotion(update))
      }
    },
    [dispatch]
  )

  return (
    <Modal
      show={true}
      onHide={props.onHide}
      dialogClassName="pokemon-emotions-modal is-dark is-large"
    >
      <Modal.Header>
        <Modal.Title>
          <img
            src={getPortraitSrc(
              index,
              pConfig.selectedShiny,
              pConfig.selectedEmotion
            )}
            className={cc({ unlocked: pConfig != null })}
          />
          <h1>{t(`pkm.${props.pokemon}`)}</h1>
          <div className="spacer" />
          <p className="dust">
            {pConfig.dust} <img src={getPortraitSrc(index)} alt="dust" />
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section>
          <p>{t("normal_emotions")}</p>
          <div>
            {availableEmotions.map((e) => {
              return (
                <PokemonEmotion
                  key={e}
                  index={index}
                  shiny={false}
                  unlocked={pConfig && pConfig.emotions.includes(e)}
                  path={index.replace("-", "/")}
                  emotion={e}
                  dust={pConfig.dust}
                  onClick={() =>
                    handlePokemonEmotionClick(
                      Boolean(pConfig && pConfig.emotions.includes(e)),
                      { index: index, emotion: e, shiny: false }
                    )
                  }
                />
              )
            })}
          </div>
        </section>
        <section>
          <p>{t("shiny_emotions")}</p>
          <div>
            {availableEmotions.map((e) => {
              return (
                <PokemonEmotion
                  key={e}
                  index={index}
                  shiny={true}
                  unlocked={pConfig && pConfig.shinyEmotions.includes(e)}
                  path={`${index.replace("-", "/")}/0000/0001`}
                  emotion={e}
                  dust={pConfig.dust}
                  onClick={() =>
                    handlePokemonEmotionClick(
                      Boolean(pConfig && pConfig.shinyEmotions.includes(e)),
                      { index: index, emotion: e, shiny: true }
                    )
                  }
                />
              )
            })}
          </div>
        </section>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="bubbly blue"
          disabled={pConfig.dust < 500}
          onClick={() => dispatch(buyBooster({ index }))}
        >
          {t("buy_booster_500")}
          <img src={getPortraitSrc(index)} alt="dust" />
        </button>
        <div className="spacer"></div>
        <button className="bubbly red" onClick={props.onHide}>
          {t("close")}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
