import { Grid, RadioGroup, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  CloseAppButton,
  ContentButtonBlock,
  PanelBlock,
  ParsedHtml,
  PrimaryButton,
  QuestionRadioButton,
} from '../../..';
import { PanelListItem } from '../../../../api/content/types/page';
import { ParsedButtonProps } from '../../../../cms/parse-cms';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useTenantContext } from '../../../../core/contexts/TenantContext';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { JourneyQuestionsDropdown } from './JourneyQuestionsDropdown';
import { Answer } from './types';

interface Props {
  id?: string;
  loading: boolean;
  answers: Answer[];
  questionKey?: string;
  questionText?: string;
  bottomPanel?: PanelListItem;
  value: string;
  initialValue: string;
  isCloseButtonHidden: boolean;
  isDropdown: boolean | undefined;
  buttons: ParsedButtonProps[];
  onChange(answer: Answer): void;
  onContinueClick(): void;
}

export const JourneyQuestions: React.FC<Props> = ({
  id,
  value,
  answers,
  loading,
  questionText,
  bottomPanel,
  initialValue,
  questionKey,
  isCloseButtonHidden,
  isDropdown,
  buttons,
  onChange,
  onContinueClick,
}) => {
  const { labelByKey } = useGlobalsContext();
  const [isCloseButtonDisabled, setIsCloseButtonDisabled] = useState(false);
  const { page } = useContentDataContext();
  const { tenant } = useTenantContext();

  useEffect(() => {
    setIsCloseButtonDisabled(value !== initialValue);
  }, [initialValue, questionKey, value]);

  return (
    <Grid id={id} container direction="row" gap={12} data-testid="journey-questions">
      {questionText && (
        <Grid item xs={12} display="flex" sx={{ '.html-container': { display: 'flex' } }}>
          <ParsedHtml html={questionText} />
        </Grid>
      )}
      <Grid item xs={12} mt={-6}>
        {!isDropdown ? (
          <RadioGroup onChange={handleChange} value={value || initialValue} data-testvalue={value}>
            {answers.map((answer, idx) => (
              <QuestionRadioButton
                id={`journey-answer-${idx + 1}`}
                key={answer.answerKey}
                value={answer.answerKey}
                disabled={loading && value !== answer.answerKey}
                label={
                  <Stack direction="column" gap={1.5} component="span" data-testid={`radio-answer-${idx + 1}`}>
                    {answer.answer}
                    {answer.descriptionPanels?.map((panel, idx) => (
                      <PanelBlock
                        key={idx}
                        page={page!}
                        tenant={tenant}
                        header={panel.elements?.header}
                        columns={panel.elements?.columns}
                        layout={panel.elements?.layout}
                        panelKey={panel.elements?.panelKey?.value}
                        reverseStacking={panel.elements?.reverseStacking}
                      />
                    ))}
                  </Stack>
                }
              />
            ))}
          </RadioGroup>
        ) : (
          <JourneyQuestionsDropdown
            answers={answers}
            value={value || initialValue}
            onChange={handleChange}
            loading={loading}
            label={labelByKey(`${questionKey}_dropdown_label`)}
            placeholder={labelByKey(`${questionKey}_dropdown_placeholder`)}
          />
        )}
      </Grid>
      {bottomPanel && (
        <Grid item xs={12}>
          <PanelBlock
            page={page!}
            tenant={tenant}
            header={bottomPanel.elements?.header}
            columns={bottomPanel.elements?.columns}
            layout={bottomPanel.elements?.layout}
            reverseStacking={bottomPanel.elements?.reverseStacking}
            panelKey={bottomPanel.elements?.panelKey?.value}
          />
        </Grid>
      )}
      <Grid item xs={12} container spacing={4}>
        <Grid item>
          <PrimaryButton onClick={onContinueClick} loading={loading} disabled={!value} data-testid="continue">
            {labelByKey('continue')}
          </PrimaryButton>
        </Grid>
        {!isCloseButtonHidden && (
          <Grid item>
            <CloseAppButton disabled={isCloseButtonDisabled} />
          </Grid>
        )}
        {buttons.map((btn, idx) => (
          <Grid item key={idx} width={btn.widthPercentage ? `${btn.widthPercentage}%` : 'unset'}>
            <ContentButtonBlock
              {...btn}
              widthPercentage={btn.widthPercentage ? 100 : undefined}
              disabled={isCloseButtonDisabled}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );

  function handleChange(_: React.ChangeEvent<HTMLInputElement>, value: string) {
    if (loading) return;

    const answer = answers.find(i => i.answerKey === value);
    if (answer) {
      onChange(answer);
    } else {
      throw new Error(`Answer with key ${value} not found.`);
    }
  }
};
