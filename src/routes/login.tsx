import { Button, Card, FormGroup, InputGroup, Menu, MenuItem, Popover, Switch } from '@blueprintjs/core';
import { useState } from 'react';

const instanceTypeString = {
  mastodon: '마스토돈',
  //misskey: '미스키'
};
type InstanceType = keyof typeof instanceTypeString;

export function Component() {
  const [instanceType, setInstanceType] = useState<InstanceType>('mastodon');

  const InstanceTypeSelector = (
    <Popover content={
      <Menu>
        { (Object.keys(instanceTypeString) as InstanceType[]).map((key) => <MenuItem text={instanceTypeString[key]} key={key} onClick={() => setInstanceType(key)}/>) }
      </Menu>
    } placement="bottom-end">
      <Button minimal={true} rightIcon="caret-down">{instanceTypeString[instanceType]}</Button>
    </Popover>
  );
  return <Card>
    <h1>로그인</h1>
    <form action={`/api/auth/${instanceType}`}>
      <FormGroup label="서버 주소">
        <InputGroup placeholder="planet.moe" rightElement={InstanceTypeSelector} name="instance"/>
      </FormGroup>
      <Switch label="강제 재로그인" name="forceLogin" value="true"/>
      <Button fill type="submit">로그인</Button>
    </form>
  </Card>
}