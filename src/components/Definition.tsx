import { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconNewWindow, IconPlay } from 'assets/images';
import { useWindowDimensions } from 'hooks';
import { Heading, LoadingSpinner, Text } from 'components';
import styles from 'styles/Definition.module.scss';

type DefinitionType = { definition: string; example?: string };
type MeaningType = {
  partOfSpeech: string;
  definitions: DefinitionType[];
  synonyms: string[];
  antonyms: string[];
};

interface DataType {
  phonetic: string;
  meanings: MeaningType[];
  sources: string[];
}

interface Props {
  word: string;
}

let timeout: NodeJS.Timeout;
let fetchController: AbortController | null = null;

export default function Definition(props: Props) {
  const { word } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<DataType>();
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [windowWidth] = useWindowDimensions();

  const playAudio = () => {
    if (!audio) return;
    clearTimeout(timeout);
    setIsAudioPlaying(true);

    timeout = setTimeout(() => {
      setIsAudioPlaying(false);
    }, audio.duration * 1000);
    audio.currentTime = 0;
    audio.play();
  };

  useEffect(() => {
    fetchController?.abort();
    fetchController = new AbortController();

    setNotFound(false);
    setData(undefined);
    setAudio(undefined);

    if (word.trim()) {
      setIsLoading(true);

      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
        method: 'get',
        signal: fetchController.signal,
      })
        .then((response) => {
          if (response.status === 404) {
            setNotFound(true);
          } else {
            return response.json();
          }
        })
        .then((data) => {
          if (!data) return;
          const [wordData] = data;
          setIsLoading(false);

          let phonetic = '';

          for (let i = 0; i < wordData.phonetics.length; i++) {
            const item = wordData.phonetics[i];

            if (item.text && item.audio) {
              phonetic = item.text;
              setAudio(new Audio(item.audio));
              break;
            }

            if (item.text) {
              phonetic = item.text;
            }
          }

          if (wordData) {
            setData({
              phonetic,
              meanings: wordData.meanings.map(
                (meaning: MeaningType) =>
                  ({
                    partOfSpeech: meaning.partOfSpeech,
                    antonyms: Array.from(new Set(meaning.antonyms)),
                    synonyms: Array.from(new Set(meaning.synonyms)),
                    definitions: meaning.definitions.map((item) => ({
                      definition: item.definition,
                      example: item.example,
                    })),
                  } as MeaningType)
              ),
              sources: wordData.sourceUrls,
            });
          }
        });
    }
  }, [word]);

  const handleWordClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const { textContent } = e.target as HTMLAnchorElement;

    if (textContent && textContent !== word) {
      searchParams.set(
        'word',
        textContent[textContent.length - 1] === ','
          ? textContent.slice(0, -1)
          : textContent
      );
      setSearchParams(searchParams);
    }
  };

  return (
    <div>
      {!notFound ? (
        <>
          <div className={styles.header}>
            <div>
              <Heading level="1">{word}</Heading>
              {data?.phonetic &&
                (windowWidth > 375 ? (
                  <Heading level="2" className={styles['phonetic-text']}>
                    {data.phonetic}
                  </Heading>
                ) : (
                  <Text size="M" className={styles['phonetic-text']}>
                    {data.phonetic}
                  </Text>
                ))}
            </div>
            {audio && (
              <button
                className={`${styles['button-play']} ${
                  isAudioPlaying ? styles['button-play--playing'] : ''
                }`}
                onClick={playAudio}
              >
                <IconPlay className={styles['button-play__icon']} />
              </button>
            )}
          </div>

          {isLoading ? (
            <LoadingSpinner className={styles['loading-spinner']} />
          ) : (
            <>
              {data?.meanings.map((meaning, i) => (
                <Fragment key={i}>
                  <div className={styles.meaning}>
                    <div className={styles['meaning__partOfSpeech']}>
                      <p>{meaning.partOfSpeech}</p>
                    </div>
                    <Heading level="3" className={styles['meaning-heading']}>
                      Meaning
                    </Heading>
                    <ul className={styles['definitions-list']}>
                      {meaning.definitions.map((item, i) => (
                        <li key={i} className={styles['meaning__definition']}>
                          <Text
                            size="M"
                            className={styles['meaning__definition-text']}
                          >
                            {item.definition}
                          </Text>
                          {item.example && (
                            <Text
                              size="M"
                              className={styles['meaning__definition-example']}
                            >
                              "{item.example}"
                            </Text>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {(!!meaning.synonyms.length || !!meaning.antonyms.length) && (
                    <div className={styles['onyms-wrapper']}>
                      {!!meaning.synonyms.length && (
                        <div className={styles.onyms}>
                          <Heading level="3" className={styles['onyms__heading']}>
                            Synonyms
                          </Heading>
                          <div className={styles['onyms__words']}>
                            {meaning.synonyms.map((synonym, i) => (
                              <a
                                key={synonym}
                                href={`?search=${synonym}`}
                                onClick={handleWordClick}
                              >
                                {synonym}
                                {i !== meaning.synonyms.length - 1 && ','}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {!!meaning.antonyms.length && (
                        <div className={styles.onyms}>
                          <Heading level="3" className={styles['onyms__heading']}>
                            Antonyms
                          </Heading>
                          <div className={styles['onyms__words']}>
                            {meaning.antonyms.map((antonym, i) => (
                              <a
                                key={antonym}
                                href={`?search=${antonym}`}
                                onClick={handleWordClick}
                              >
                                {antonym}
                                {i !== meaning.antonyms.length - 1 && ','}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Fragment>
              ))}

              {!!data?.sources.length && (
                <div className={styles.sources}>
                  <Text size="S" className={styles['sources__text']}>
                    Source
                  </Text>
                  <div className={styles['sources__anchors']}>
                    {data?.sources.map((source) => (
                      <a key={source} href={source} target="_blank" rel="noreferrer">
                        <Text size="S" tag="span">
                          {source}
                        </Text>
                        <IconNewWindow
                          className={styles['sources__icon-new-window']}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className={styles['not-found']}>
          <span className={styles['not-found__emoji']}>😕</span>
          <h1 className={styles['not-found__heading']}>No Definitions Found</h1>
          <Text size="M" className={styles['not-found__paragraph']}>
            Sorry pal, we couldn't find definitions for the word you were looking
            for. You can try the search again at later time or head to the web
            instead.
          </Text>
        </div>
      )}
    </div>
  );
}
