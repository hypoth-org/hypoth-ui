'use client';

import { useState } from 'react';
import { Input, Textarea, Switch, Checkbox, RadioGroup, Radio, Select } from '@hypoth-ui/react';
import { formsSectionContent } from '@hypoth-ui/demo-shared';
import { SidebarNav } from '../../components/sidebar-nav';
import { AppShell } from '../../components/app-shell';
import { ThemeToggle } from '../../components/theme-toggle';

export default function FormsPage() {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');

  return (
    <AppShell
      sidebar={<SidebarNav />}
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Demo - React</h1>
          <ThemeToggle />
        </div>
      }
    >
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Dashboard</a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current" aria-current="page">Forms</span>
      </nav>
      <div className="page-header">
        <h2 className="page-title">{formsSectionContent.title}</h2>
        <p className="page-description">{formsSectionContent.description}</p>
      </div>

      {/* Input Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Input</h3>
        <p className="showcase-description">
          A text input field for collecting user data.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <div>
              <label htmlFor="default-input" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                Default Input
              </label>
              <Input
                id="default-input"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(value) => setInputValue(value)}
              />
            </div>
            <div>
              <label htmlFor="disabled-input" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                Disabled Input
              </label>
              <Input id="disabled-input" placeholder="Disabled" disabled />
            </div>
          </div>
        </div>
      </div>

      {/* Textarea Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Textarea</h3>
        <p className="showcase-description">
          A multi-line text input for longer content.
        </p>
        <div className="showcase-demo">
          <div style={{ maxWidth: '400px' }}>
            <label htmlFor="textarea" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
              Message
            </label>
            <Textarea
              id="textarea"
              placeholder="Enter your message..."
              value={textareaValue}
              onChange={(value) => setTextareaValue(value)}
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Checkbox Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Checkbox</h3>
        <p className="showcase-description">
          A toggle for boolean options.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Checkbox
              checked={checkboxChecked}
              onChange={(checked) => setCheckboxChecked(checked)}
            >
              Accept terms and conditions
            </Checkbox>
            <Checkbox disabled>Disabled checkbox</Checkbox>
            <Checkbox defaultChecked>Pre-checked option</Checkbox>
          </div>
        </div>
      </div>

      {/* Radio Group Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Radio Group</h3>
        <p className="showcase-description">
          A group of mutually exclusive options.
        </p>
        <div className="showcase-demo">
          <RadioGroup
            value={radioValue}
            onChange={(value) => setRadioValue(value)}
          >
            <Radio value="option1">Option 1</Radio>
            <Radio value="option2">Option 2</Radio>
            <Radio value="option3">Option 3</Radio>
          </RadioGroup>
        </div>
      </div>

      {/* Switch Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Switch</h3>
        <p className="showcase-description">
          A toggle switch for on/off states.
        </p>
        <div className="showcase-demo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Switch
              checked={switchChecked}
              onChange={setSwitchChecked}
            >
              Enable notifications
            </Switch>
            <Switch disabled>Disabled switch</Switch>
            <Switch defaultChecked>Pre-enabled option</Switch>
          </div>
        </div>
      </div>

      {/* Select Showcase */}
      <div className="showcase-card">
        <h3 className="showcase-title">Select</h3>
        <p className="showcase-description">
          A dropdown selection component.
        </p>
        <div className="showcase-demo">
          <div style={{ maxWidth: '300px' }}>
            <label htmlFor="select" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
              Choose an option
            </label>
            <Select.Root>
              <Select.Trigger>
                <Select.Value placeholder="Select an option" />
              </Select.Trigger>
              <Select.Content>
                <Select.Option value="option1">Option 1</Select.Option>
                <Select.Option value="option2">Option 2</Select.Option>
                <Select.Option value="option3">Option 3</Select.Option>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
